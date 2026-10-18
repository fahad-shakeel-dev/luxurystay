import HeroSection from "@/components/HeroSection"
import FeaturedRooms from "@/components/FeaturedRooms"
import { WelcomeStrip, HomeExperiences, HomeStory, StayInvitation } from "@/components/HomeSections"


export default function Home() {
  return (
    <main className="home-page">
      <HeroSection />
      <WelcomeStrip />
      <FeaturedRooms />
      <HomeExperiences />
      <HomeStory />
      <StayInvitation />
    </main>
  )
}
