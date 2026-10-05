import { API_URL, DEMO_MODE } from './config';
import { Client, Gift, GiftWinner, ImageAd, Partner, VideoAd } from './types';

type Success<T> = { status: 'success'; data: T };
type Failure = { status: 'error' | 'fail'; message: string };
type Result<T> = Success<T> | Failure;
type Guard<T> = (value: unknown) => value is T;
let clientId: string | null = null;
let demoClient: Client = { _id: 'demo-client', scratches: 0, tokens: 0, hasAdditionalScratch: false, unclaimedGifts: [] };
const record = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const client: Guard<Client> = (v): v is Client => record(v) && typeof v._id === 'string' && typeof v.scratches === 'number' && typeof v.tokens === 'number' && typeof v.hasAdditionalScratch === 'boolean';
const gift: Guard<Gift> = (v): v is Gift => record(v) && typeof v._id === 'string' && typeof v.name === 'string' && typeof v.image === 'string' && ['token', 'poklon', 'vaučer'].includes(String(v.type));
const winner: Guard<GiftWinner> = (v): v is GiftWinner => record(v) && typeof v._id === 'string' && gift(v.gift);
const imageAd: Guard<ImageAd> = (v): v is ImageAd => record(v) && typeof v._id === 'string' && typeof v.image === 'string' && typeof v.link === 'string' && typeof v.name === 'string';
const videoAd: Guard<VideoAd> = (v): v is VideoAd => record(v) && typeof v._id === 'string' && typeof v.video === 'string' && typeof v.link === 'string' && typeof v.name === 'string';
const partner: Guard<Partner> = (v): v is Partner => record(v) && typeof v.name === 'string' && typeof v.logo === 'string' && typeof v.link === 'string';
const list = <T>(guard: Guard<T>): Guard<T[]> => (v): v is T[] => Array.isArray(v) && v.every(guard);
const failure = (message: string): Failure => ({ status: 'error', message });
const success = <T>(data: T): Success<T> => ({ status: 'success', data });

async function request<T>(path: string, guard: Guard<T>, init?: RequestInit): Promise<Result<T>> {
  if (!API_URL) return failure('Configure an API URL or enable demo mode.');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${API_URL}${path}`, { ...init, signal: controller.signal });
    const body: unknown = await response.json();
    if (!response.ok || !record(body) || body.status !== 'success') return failure('Request failed. Please retry.');
    if (!guard(body.data)) return failure('The service returned an invalid response.');
    return success(body.data);
  } catch { return failure('Service unavailable. Please retry.'); }
  finally { clearTimeout(timer); }
}
const post = (data: unknown): RequestInit => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export async function getClient(id: string): Promise<Result<Client>> {
  const result = DEMO_MODE ? success({ ...demoClient }) : await request(`/clients/${encodeURIComponent(id)}`, client);
  if (result.status === 'success') clientId = result.data._id;
  return result;
}
export async function createClient(): Promise<Result<Client>> {
  const result = DEMO_MODE ? success({ ...demoClient }) : await request('/clients', client, post({}));
  if (result.status === 'success') clientId = result.data._id;
  return result;
}
export async function getImageAds(screen = 'main'): Promise<Result<ImageAd[]>> {
  return DEMO_MODE ? success([]) : request(`/ads/image?screen=${encodeURIComponent(screen)}`, list(imageAd));
}
export async function getAdditionalAds(): Promise<Result<ImageAd[]>> {
  return DEMO_MODE ? success([]) : request('/ads/additional', list(imageAd));
}
export async function getGifts(): Promise<Result<Gift[]>> { return DEMO_MODE ? success([]) : request('/gifts', list(gift)); }
export async function getSearchedGifts(value: string): Promise<Result<Gift[]>> {
  return DEMO_MODE ? success([]) : request(`/gifts/search?q=${encodeURIComponent(value.trim())}`, list(gift));
}
export async function getPartners(): Promise<Result<Partner[]>> { return DEMO_MODE ? success([]) : request('/partners', list(partner)); }
type ScratchResult = { gift: Gift | null; giftWinner: GiftWinner | null };
const scratch: Guard<ScratchResult> = (v): v is ScratchResult => record(v) && (v.gift === null || gift(v.gift)) && (v.giftWinner === null || winner(v.giftWinner));
export async function handleScratch(): Promise<Result<ScratchResult>> {
  if (DEMO_MODE) {
    demoClient = { ...demoClient, scratches: demoClient.scratches + 1 };
    return success({ gift: null, giftWinner: null });
  }
  if (!clientId) return failure('Client is not initialized.');
  return request('/scratch', scratch, post({ clientId }));
}
export async function getLimit(): Promise<Result<number>> {
  return DEMO_MODE ? success(100) : request('/options/limit', (v): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0);
}
export async function getPriorityAd(screen = 'main-cta'): Promise<Result<ImageAd | VideoAd>> {
  if (DEMO_MODE) return failure('Advertisements are disabled in demo mode.');
  return request(`/ads/priority?clientId=${encodeURIComponent(clientId || '')}&screen=${encodeURIComponent(screen)}`, (v): v is ImageAd | VideoAd => imageAd(v) || videoAd(v));
}
export async function updateAdAnalytics(adId: string | undefined, watchTime?: number, timesClicked?: number): Promise<Result<null>> {
  if (DEMO_MODE) return success(null);
  return request('/analytics/ad', (v): v is null => v === null, { ...post({ adId, watchTime, timesClicked }), method: 'PATCH' });
}
export async function convertTokens(): Promise<Result<Client>> {
  if (DEMO_MODE) return success({ ...demoClient });
  if (!clientId) return failure('Client is not initialized.');
  return request('/clients/tokens', client, post({ clientId }));
}
export async function getGiftWinnerById(id: string): Promise<Result<GiftWinner>> {
  return DEMO_MODE ? failure('No real rewards exist in demo mode.') : request(`/giftWinners/${encodeURIComponent(id)}`, winner);
}
export async function claimGiftByCode(code: string): Promise<Result<GiftWinner>> {
  if (DEMO_MODE) return failure('Reward claims are disabled in demo mode.');
  if (!clientId) return failure('Client is not initialized.');
  return request('/giftWinners/claimByCode', winner, post({ clientId, code: code.trim() }));
}
