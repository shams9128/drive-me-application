import { Link } from "react-router-dom";
import { ShieldCheck, BadgeCheck, Headphones, Users, MapPin, Wallet } from "lucide-react";
import { COLORS, Section, FeatureCard } from "../components/PageSections";

export default function AboutPage() {
  return (
    <>
      <Section background={COLORS.bg1} color={COLORS.white}>
        <h3 style={{ marginBottom: 20, fontSize: 28, fontWeight: 600 }}>About DriveMe</h3>
        <p style={{ maxWidth: 640, margin: "0 auto", fontSize: 17 }}>
          DriveMe is a pool-driving platform that connects people making the same trip, so
          nobody has to drive — or pay for the drive — alone.
        </p>
      </Section>

      <Section background={COLORS.bg3} color={COLORS.bg3Text}>
        <h3 style={{ marginBottom: 20, fontSize: 26, fontWeight: 600 }}>Our Mission</h3>
        <p style={{ maxWidth: 640, margin: "0 auto" }}>
          Long commutes and highway drives are more fun, safer and cheaper when they&apos;re
          shared. DriveMe makes it simple to offer a spare seat on a route you&apos;re already
          driving, or to find a verified driver headed the same way you are.
        </p>
      </Section>

      <Section background={COLORS.bg2} color={COLORS.white}>
        <h3 style={{ marginBottom: 45, fontSize: 26, fontWeight: 600 }}>Why people use DriveMe</h3>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 30 }}>
          <FeatureCard icon={<Wallet size={40} color={COLORS.white} />} title="Split the cost">
            Sharing a ride means sharing fuel and toll costs, so every trip is lighter on your
            wallet.
          </FeatureCard>
          <FeatureCard icon={<MapPin size={40} color={COLORS.white} />} title="Match by route">
            Search by start point, drop location and date to find rides that actually fit your
            trip.
          </FeatureCard>
          <FeatureCard icon={<Users size={40} color={COLORS.white} />} title="Built by riders">
            DriveMe started as a small carpooling project by people tired of driving long
            highway stretches solo.
          </FeatureCard>
        </div>
      </Section>

      <Section background={COLORS.bg3} color={COLORS.bg3Text}>
        <h3 style={{ marginBottom: 45, fontSize: 26, fontWeight: 600 }}>What we stand for</h3>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 30 }}>
          <FeatureCard icon={<ShieldCheck size={40} />} title="Safest">
            Safety is our first priority. We have 0 tolerance against harassment.
          </FeatureCard>
          <FeatureCard icon={<BadgeCheck size={40} />} title="Verified Rides">
            All rides are verified rides. Riders have a valid driving license, insurance and a
            car in good condition.
          </FeatureCard>
          <FeatureCard icon={<Headphones size={40} />} title="24x7 Support">
            In case of any problem or emergency, we're always here to help — round the clock.
          </FeatureCard>
        </div>
      </Section>

      <Section background={COLORS.bg4} color={COLORS.white} style={{ padding: "50px 20px" }}>
        <h3 style={{ marginBottom: 20, fontSize: 22, fontWeight: 600 }}>Ready to drive with fun?</h3>
        <Link
          to="/createUser"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 26px",
            fontSize: 16,
            border: "1px solid #ffffff",
            borderRadius: 4,
            color: "#ffffff",
            textDecoration: "none",
          }}
        >
          Sign Up
        </Link>
      </Section>
    </>
  );
}
