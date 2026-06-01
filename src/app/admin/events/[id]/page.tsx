import { supabaseAdmin } from '@/lib/supabase/server';
import type { Event } from '@/lib/types';
import { notFound } from 'next/navigation';
import { updateEventAction } from './actions';

export const revalidate = 0;

function toDatetimeInput(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso).toISOString().slice(0, 16);
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEventEditPage({ params }: Props) {
  const { id } = await params;

  const { data } = await supabaseAdmin.from('events').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  const event = data as Event;

  return (
    <div className="px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <a href="/admin/events" className="text-text-dim text-sm hover:text-gold transition-colors mb-8 inline-block">
          ← All events
        </a>

        <h1 className="font-display text-4xl text-gold mb-2">{event.title}</h1>
        <p className="text-text-dim text-sm mb-10">
          All times are UTC. The site displays them in Pacific Time automatically.
        </p>

        <form action={updateEventAction} className="flex flex-col gap-5">
          <input type="hidden" name="id" value={event.id} />

          <Field label="Title *">
            <input name="title" type="text" required defaultValue={event.title}
              className="field-input" />
          </Field>

          <Field label="Slug *">
            <input name="slug" type="text" required defaultValue={event.slug}
              className="field-input" />
          </Field>

          <Field label="Description">
            <textarea name="description" rows={3} defaultValue={event.description ?? ''}
              className="field-input resize-none" />
          </Field>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Starts at (UTC) *">
              <input name="starts_at" type="datetime-local" required
                defaultValue={toDatetimeInput(event.starts_at)}
                className="field-input" />
            </Field>
            <Field label="Ends at (UTC)">
              <input name="ends_at" type="datetime-local"
                defaultValue={toDatetimeInput(event.ends_at)}
                className="field-input" />
            </Field>
          </div>

          <Field label="Location">
            <input name="location" type="text" defaultValue={event.location ?? ''}
              className="field-input" />
          </Field>

          <Field label='Pricing tiers (JSON — leave blank for "Hosted")'>
            <textarea
              name="pricing_tiers"
              rows={3}
              defaultValue={event.pricing_tiers ? JSON.stringify(event.pricing_tiers, null, 2) : ''}
              placeholder={'[\n  { "min": 1, "max": 15, "perPerson": 120 },\n  { "min": 16, "max": 99, "perPerson": 100 }\n]'}
              className="field-input resize-none font-mono-x text-xs"
            />
          </Field>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Display order">
              <input name="display_order" type="number"
                defaultValue={event.display_order ?? 0}
                className="field-input" />
            </Field>
            <div className="flex flex-col gap-1 justify-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input name="is_featured" type="checkbox"
                  defaultChecked={event.is_featured} className="accent-gold" />
                <span className="text-sm text-text">Centerpiece event</span>
              </label>
            </div>
          </div>

          <button type="submit"
            className="rsvp-chip px-6 py-3 rounded-full uppercase text-sm tracking-widest font-medium mt-2">
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs uppercase tracking-widest text-text-dim">{label}</label>
      {children}
    </div>
  );
}
