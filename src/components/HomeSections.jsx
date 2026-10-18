import Link from "next/link"
import { ArrowUpRight, Wifi, ConciergeBell, Clock3, BedDouble, Coffee, Leaf, MessageCircle, Check } from "lucide-react"

const comforts = [
  { icon: Wifi, title: "Stay connected", detail: "Complimentary WiFi" },
  { icon: BedDouble, title: "Rest easy", detail: "Comfort in every room" },
  { icon: ConciergeBell, title: "Make yourself at home", detail: "Room service available" },
  { icon: Clock3, title: "We're here for you", detail: "24-hour reception" },
]

export function WelcomeStrip() {
  return (
    <div className="home-comforts" aria-label="A few comforts included in your stay">
      <div className="stays-container home-comforts-grid">
        {comforts.map(({ icon: Icon, title, detail }) => (
          <div className="home-comfort" key={title}><Icon size={23} strokeWidth={1.4} aria-hidden="true" /><div><p>{title}</p><span>{detail}</span></div></div>
        ))}
      </div>
    </div>
  )
}

const experiences = [
  { icon: Coffee, number: "01", title: "Good food. Your way.", description: "Start with a slow breakfast or settle in with room service. There is always time for something delicious." },
  { icon: Leaf, number: "02", title: "Room to recharge.", description: "Leave the rush outside. Find a quiet corner, get comfortable, and enjoy a little time to yourself." },
  { icon: MessageCircle, number: "03", title: "A welcome that stays.", description: "From your first question to your final checkout, our team is here to help you feel at home." },
]

export function HomeExperiences() {
  return (
    <section className="home-experiences" aria-labelledby="home-experiences-heading">
      <div className="stays-container">
        <div className="home-section-heading">
          <div><p className="stays-eyebrow"><span /> Beyond the room</p><h2 id="home-experiences-heading">It's the little things<br />that make the stay.</h2></div>
          <Link href="/services" className="stays-featured-link">Discover our services <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
        <div className="home-experience-grid">
          {experiences.map(({ icon: Icon, number, title, description }) => (
            <article className="home-experience" key={number}>
              <div className="home-experience-top"><span className="home-experience-icon"><Icon size={25} strokeWidth={1.4} aria-hidden="true" /></span><span className="home-experience-number" aria-hidden="true">{number}</span></div>
              <h3>{title}</h3><p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HomeStory() {
  return (
    <section className="home-story" aria-labelledby="home-story-heading">
      <div className="stays-container home-story-grid">
        <div className="home-story-photo"><img src="/images/photo-1445019980597-93fa8acb246c.jpg" alt="Relaxing loungers on a sunlit terrace overlooking the mountains" loading="lazy" /><div className="home-story-caption"><span>Take a breath.</span><p>You're somewhere special.</p></div></div>
        <div className="home-story-copy">
          <p className="stays-eyebrow"><span /> The LuxuryStay feeling</p>
          <h2 id="home-story-heading">Thoughtful spaces.<br /><span>Effortless stays.</span></h2>
          <p>A quiet morning, a comfortable room, and a team ready to help. Make time for a stay that moves at your pace.</p>
          <ul><li><Check size={16} aria-hidden="true" /> Rooms for solo escapes, couples, and families</li><li><Check size={16} aria-hidden="true" /> A friendly team, whenever you need us</li><li><Check size={16} aria-hidden="true" /> Simple booking, from arrival to checkout</li></ul>
          <Link href="/about" className="stays-featured-link">Get to know LuxuryStay <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  )
}

export function StayInvitation() {
  return (
    <section className="home-invitation" aria-labelledby="home-invitation-heading">
      <div className="stays-container">
        <div className="home-invitation-panel">
          <div><p className="stays-eyebrow"><span /> Make a little time for you</p><h2 id="home-invitation-heading">Your next stay starts here.</h2><p>Pick your room. Plan your escape. We'll take care of the welcome.</p></div>
          <div className="home-invitation-actions"><Link href="/rooms" className="hotel-hero-book">Find your room <ArrowUpRight size={18} aria-hidden="true" /></Link><a href="https://wa.me/92395534343" target="_blank" rel="noopener noreferrer" className="home-contact-link">Have a question? Let's talk <ArrowUpRight size={16} aria-hidden="true" /></a></div>
        </div>
      </div>
    </section>
  )
}
