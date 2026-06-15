import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Klynn Ceramics" },
      { name: "description", content: "Get in touch, place a trade enquiry, or simply say hello." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="pt-28 md:pt-36 container-editorial">
      <header className="max-w-2xl mb-16 fade-in">
        <p className="eyebrow">Contact</p>
        <h1 className="serif text-5xl md:text-7xl mt-4">Get in touch.</h1>
        <p className="text-base md:text-lg text-muted-foreground mt-6 leading-relaxed">
          Drop a note for trade enquiries, custom commissions,
          or simply to say hello.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-16 md:gap-24">
        <div className="space-y-10">

          <div>
            <p className="eyebrow mb-3">Get in touch</p>
            <p className="text-lg leading-relaxed">
              <a href="mailto:klynnceramics@gmail.com" className="link-underline">klynnceramics@gmail.com</a><br />
              <a href="tel:+918308474731" className="link-underline">+91 83084 74731</a>
            </p>
          </div>

        </div>

        <form
          method="POST"
          action={`https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/contact`}
          className="space-y-7"
        >
          <input type="hidden" name="form_type" value="contact" />
          <input type="hidden" name="utf8" value="✓" />
          <Field label="Name" name="contact[name]" />
          <Field label="Email" name="contact[email]" type="email" />
          <div>
            <label className="eyebrow mb-2 block">Subject</label>
            <select name="contact[subject]" className="w-full bg-transparent border-b border-border focus:border-primary py-3 text-base outline-none transition-colors">
              <option>General enquiry</option>
              <option>Trade &amp; wholesale</option>
              <option>Custom commission</option>
              <option>Press</option>
            </select>
          </div>
          <div>
            <label className="eyebrow mb-2 block">Message</label>
            <textarea name="contact[body]" rows={5} className="w-full bg-transparent border-b border-border focus:border-primary py-3 text-base outline-none resize-none transition-colors" placeholder="Tell us a little about it…" />
          </div>
          <button className="btn-primary" type="submit">Send message</button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow mb-2 block">{label}</label>
      <input id={name} name={name} type={type} required className="w-full bg-transparent border-b border-border focus:border-primary py-3 text-base outline-none transition-colors" />
    </div>
  );
}
