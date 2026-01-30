import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'What types of products does Honeywell offer in this catalogue?',
    answer:
      'We offer a premium range of Audio products including Bluetooth Headphones, Speakers, Soundbars, and TWS Earbuds. Our Power Solutions lineup features high-quality Surge Protectors and durable Charging Cables.',
  },
  {
    question: 'Are Honeywell audio products water-resistant?',
    answer:
      'Yes, many of our products are designed for durability. For instance, the Suono P100 Bluetooth Speaker features an IPX7 waterproof rating, while others like the Trueno U100 have IPX4 water resistance, making them perfect for active lifestyles.',
  },
  {
    question: 'Do your headphones feature noise cancellation?',
    answer:
      'Absolutely. Our Trueno U10 ANC Bluetooth Headphones are equipped with Advanced Noise Cancellation technology to block out external noise for an immersive listening experience.',
  },
  {
    question: 'What is the warranty on Honeywell Surge Protectors?',
    answer:
      'Our Platinum Series surge protectors offer exceptional peace of mind with Device Secure Warranty coverage. Depending on the model, coverage can range up to US$ 15,000, protecting your connected devices against power spikes and surges.',
  },
  {
    question: 'What connectivity options do the Soundbars support?',
    answer:
      'Our soundbars are versatile and ready for any setup. Models like the Trueno U1000 and Suono P1000 support Bluetooth V5.0, HDMI (ARC), Optical, Coaxial, USB, and AUX inputs, ensuring seamless connection to your TV and other devices.',
  },
]

export function FAQ() {
  return (
    <section className="w-full py-6 md:py-10 bg-muted/30 border-t border-border">
      <div className="container px-4 md:px-6 mx-auto max-w-3xl">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-xl md:text-3xl font-black tracking-tighter uppercase">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="text-left cursor-pointer text-base md:text-lg font-bold hover:no-underline hover:text-primary transition-colors py-4 md:py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-4 md:pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
