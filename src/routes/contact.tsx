import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

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
  const [sent, setSent] = useState(false);
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
              <a href="mailto:hello@klynnceramics.com" className="link-underline">hello@klynnceramics.com</a><br />
              <a href="tel:+61200000000" className="link-underline">+61 2 0000 0000</a>
            </p>
          </div>

        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="space-y-7"
        >
          <Field label="Name" name="name" />
          <Field label="Email" name="email" type="email" />
          <div>
            <label className="eyebrow mb-2 block">Subject</label>
            <select className="w-full bg-transparent border-b border-border focus:border-primary py-3 text-base outline-none transition-colors">
              <option>General enquiry</option>
              <option>Trade &amp; wholesale</option>
              <option>Custom commission</option>
              <option>Press</option>
            </select>
          </div>
          <div>
            <label className="eyebrow mb-2 block">Message</label>
            <textarea rows={5} className="w-full bg-transparent border-b border-border focus:border-primary py-3 text-base outline-none resize-none transition-colors" placeholder="Tell us a little about it…" />
          </div>
          <button className="btn-primary" type="submit">{sent ? "Thank you, we'll be in touch" : "Send message"}</button>
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
