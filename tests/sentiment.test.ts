import { describe, it, expect } from 'vitest';
import { classifySentimentFromText } from '../src/lib/sentiment';

describe('Sentiment Classification', () => {
  it('should correctly classify positive text', () => {
    expect(classifySentimentFromText('The audience response was very positive')).toBe('positive');
  });

  it('should correctly classify negative text', () => {
    expect(classifySentimentFromText('It was a negative experience')).toBe('negative');
  });

  it('should default to mixed when neither is present', () => {
    expect(classifySentimentFromText('The response was varied')).toBe('mixed');
  });
});
