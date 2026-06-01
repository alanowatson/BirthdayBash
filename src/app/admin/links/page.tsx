import { supabaseAdmin } from '@/lib/supabase/server';
import type { SiteLink, LinkIcon } from '@/lib/types';
import { upsertLinkAction } from './actions';
import DeleteLinkButton from './DeleteLinkButton';

export const revalidate = 0;

const ICON_OPTIONS: { value: LinkIcon; label: string }[] = [
  { value: 'drive', label: '📸 Photo Drive' },
  { value: 'chat', label: '💬 Chat / Group' },
  { value: 'money', label: '💸 Money / Expenses' },
  { value: 'calendar', label: '📅 Calendar' },
  { value: 'link', label: '🔗 Generic Link' },
];

function LinkForm({ link }: { link?: SiteLink }) {
  const isNew = !link;
  return (
    <form
      action={upsertLinkAction}
      className="event-card event-card-static border border-gold-soft rounded-xl p-6 flex flex-col gap-4"
    >
      {link && <input type="hidden" name="id" value={link.id} />}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-text-dim">Title *</label>
          <input
            name="title"
            type="text"
            required
            defaultValue={link?.title ?? ''}
            placeholder="WhatsApp Group"
            className="bg-transparent border border-gold-soft rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-text-dim">URL</label>
          <input
            name="url"
            type="url"
            defaultValue={link?.url ?? ''}
            placeholder="https://… (leave blank = pending)"
            className="bg-transparent border border-gold-soft rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs uppercase tracking-widest text-text-dim">Description</label>
        <input
          name="description"
          type="text"
          defaultValue={link?.description ?? ''}
          placeholder="One-line description shown on the card"
          className="bg-transparent border border-gold-soft rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:border-gold"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-text-dim">Icon</label>
          <select
            name="icon"
            defaultValue={link?.icon ?? 'link'}
            className="bg-bg border border-gold-soft rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:border-gold"
          >
            {ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-text-dim">Display order</label>
          <input
            name="display_order"
            type="number"
            defaultValue={link?.display_order ?? 100}
            className="bg-transparent border border-gold-soft rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex flex-col gap-1 justify-end">
          <label className="flex items-center gap-2 cursor-pointer pb-2">
            <input
              name="is_visible"
              type="checkbox"
              defaultChecked={link?.is_visible ?? true}
              className="accent-gold"
            />
            <span className="text-sm text-text">Visible on site</span>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="rsvp-chip px-5 py-2 rounded-full text-xs uppercase tracking-widest"
        >
          {isNew ? 'Add link' : 'Save changes'}
        </button>

        {link && <DeleteLinkButton id={link.id} title={link.title} />}
      </div>
    </form>
  );
}

export default async function AdminLinksPage() {
  const { data } = await supabaseAdmin
    .from('site_links')
    .select('*')
    .order('display_order', { ascending: true });

  const links = (data ?? []) as SiteLink[];

  return (
    <div className="px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl text-gold mb-2">Links</h1>
        <p className="text-text-dim mb-10">
          Fill in a URL to make a link go live. Leave blank to keep it as &#34;pending.&#34;
        </p>

        <div className="flex flex-col gap-6 mb-12">
          {links.map((link) => (
            <div key={link.id}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest text-text-dim">{link.title}</span>
                {link.url ? (
                  <span className="text-xs text-emerald-400">● Live</span>
                ) : (
                  <span className="text-xs text-text-dim">◇ Pending</span>
                )}
                {!link.is_visible && (
                  <span className="text-xs text-text-dim italic">· hidden</span>
                )}
              </div>
              <LinkForm link={link} />
            </div>
          ))}
        </div>

        <div className="border-t pt-10" style={{ borderColor: 'var(--gold-soft)' }}>
          <h2 className="font-display text-2xl text-gold mb-6">Add New Link</h2>
          <LinkForm />
        </div>
      </div>
    </div>
  );
}
