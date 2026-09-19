import { Link } from "react-router-dom";
import { User, ShieldCheck, BadgeCheck, Headphones, Heart } from "lucide-react";
import { COLORS, Section, FeatureCard } from "../components/PageSections";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <Section background={COLORS.bg1} color={COLORS.white}>
        <h3 style={{ marginBottom: 45, fontSize: 28, fontWeight: 600 }}>
          DriveMe is the Pool Driving Platform
        </h3>
        <h5 style={{ fontWeight: 400 }}>Don&apos;t Drive alone!</h5>
        <img
          src="http://cityfig.com/images/night_high_speed_car_driving-hd.jpg"
          alt="Night highway driving"
          style={{
            display: "inline-block",
            width: "100%",
            maxHeight: 350,
            objectFit: "cover",
            marginBottom: 45,
            marginTop: 20,
          }}
        />
        <h3 style={{ fontSize: 24, fontWeight: 600 }}>Drive with fun!</h3>
      </Section>

      {/* How we work */}
      <Section background={COLORS.bg2} color={COLORS.white}>
        <h3 style={{ marginBottom: 45, fontSize: 26, fontWeight: 600 }}>How we work?</h3>
        <p style={{ maxWidth: 640, margin: "0 auto 30px" }}>
          If you are driving alone, then just update your journey here, and the interested
          traveler will request you.
        </p>
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
          <User size={18} /> Sign Up
        </Link>
      </Section>

      {/* Features */}
      <Section background={COLORS.bg3} color={COLORS.bg3Text}>
        <h3 style={{ marginBottom: 45, fontSize: 26, fontWeight: 600 }}>Features</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 30,
          }}
        >
          <FeatureCard icon={<ShieldCheck size={40} />} title="Safest">
            Safety is our first priority. We have 0 tolerance against harassment.
          </FeatureCard>
          <FeatureCard icon={<BadgeCheck size={40} />} title="Verified Rides">
            All rides are verified rides. Riders have valid driving license, insurance and
            good car condition.
          </FeatureCard>
          <FeatureCard icon={<Headphones size={40} />} title="24x7 Support">
            In case of any problem/emergency, we are always there to help you. We are
            available round the clock!
          </FeatureCard>
        </div>
      </Section>

      {/* Footer */}
      <Section background={COLORS.bg4} color={COLORS.white} style={{ padding: "40px 20px" }}>
        <p style={{ display: "inline-flex", alignItems: "center", gap: 6, margin: 0 }}>
          Made with <Heart size={16} fill="currentColor" /> at UGA
        </p>
      </Section>
    </>
  );
}
