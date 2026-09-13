/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ArtistProfile {
  name: string;
  instagram: string;
  web: string;
  style: string;
  desc: string;
  bio: string;
  contactEmail: string;
  mediums: string;
  achievements: string;
  philosophy: string;
  phone?: string;
}

export interface Tool {
  id: string;
  icon: string;
  label: string;
  cat: string;
  description: string;
}

export interface HistoryItem {
  id: number;
  date: string;
  filename: string;
  toolId: string;
  toolLabel: string;
  summary: string;
  result: any;
  imageSrc: string; // Base64 of the image for viewing later
}

export interface CustomArtwork {
  id: string;
  title: string;
  artist: string;
  medium: string;
  year: string;
  imageSrc: string; // Base64 or URL
  isPreset?: boolean;
}

