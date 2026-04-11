import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { db, EventEntry } from 'astro:db'
import { event } from './event';

export const server = {
    event
};