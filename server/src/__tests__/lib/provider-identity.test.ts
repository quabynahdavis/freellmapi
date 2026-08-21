import { describe, expect, it } from 'vitest';
import { endpointHost, providerDisplayName, providerIdFor } from '../../lib/provider-identity.js';

describe('provider-identity', () => {
  describe('endpointHost', () => {
    it('returns the host (and port) of a base_url', () => {
      expect(endpointHost('https://relay.example.com/v1')).toBe('relay.example.com');
      expect(endpointHost('http://192.168.1.10:11434/v1')).toBe('192.168.1.10:11434');
      expect(endpointHost('https://api.openrouter.ai')).toBe('api.openrouter.ai');
    });

    it('returns null for empty or unparseable input', () => {
      expect(endpointHost(null)).toBeNull();
      expect(endpointHost(undefined)).toBeNull();
      expect(endpointHost('')).toBeNull();
      expect(endpointHost('not a url')).toBeNull();
    });
  });

  describe('providerIdFor', () => {
    it('keeps the bare platform slug for catalog providers', () => {
      expect(providerIdFor('groq', null)).toBe('groq');
      expect(providerIdFor('openai', null)).toBe('openai');
    });

    it('names a custom endpoint by its base_url so relays never collide', () => {
      expect(providerIdFor('custom', 'https://relay-a.example.com/v1')).toBe('custom:https://relay-a.example.com/v1');
      expect(providerIdFor('custom', 'https://relay-b.example.com/v1')).toBe('custom:https://relay-b.example.com/v1');
      // Two distinct relays → two distinct ids (the #889 collision).
      expect(providerIdFor('custom', 'https://relay-a.example.com/v1'))
        .not.toBe(providerIdFor('custom', 'https://relay-b.example.com/v1'));
    });

    it('falls back to the plain "custom" id when the key is gone', () => {
      expect(providerIdFor('custom', null)).toBe('custom');
      expect(providerIdFor('custom', undefined)).toBe('custom');
      expect(providerIdFor('custom', '')).toBe('custom');
    });
  });

  describe('providerDisplayName', () => {
    it('shows the endpoint host for custom rows', () => {
      expect(providerDisplayName('custom', 'https://relay-a.example.com/v1')).toBe('relay-a.example.com');
      expect(providerDisplayName('custom', 'http://192.168.1.10:11434/v1')).toBe('192.168.1.10:11434');
    });

    it('falls back to the platform when the host cannot be derived', () => {
      expect(providerDisplayName('custom', null)).toBe('custom');
      expect(providerDisplayName('custom', 'garbage')).toBe('custom');
    });

    it('shows the platform slug for catalog providers', () => {
      expect(providerDisplayName('groq', null)).toBe('groq');
    });
  });
});
