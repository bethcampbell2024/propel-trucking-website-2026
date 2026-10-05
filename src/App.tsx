import { Route, Routes } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { AdminLayout } from "@/features/admin/AdminLayout";
import { AdminLogin } from "@/features/admin/AdminLogin";
import { ApplicantDetail } from "@/features/admin/ApplicantDetail";
import { ApplicantsPage } from "@/features/admin/ApplicantsPage";
import { ForgotPassword } from "@/features/admin/ForgotPassword";
import { SetPassword } from "@/features/admin/SetPassword";
import { TeamPage } from "@/features/admin/TeamPage";
import { ApplyPage } from "@/features/apply/ApplyPage";
import { ThankYouPage } from "@/features/apply/ThankYouPage";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { DriveWithUs } from "@/pages/DriveWithUs";
import { Home } from "@/pages/Home";
import { Privacy } from "@/pages/Privacy";
import { Safety } from "@/pages/Safety";
import { WhatWeHaul } from "@/pages/WhatWeHaul";

export function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="what-we-haul" element={<WhatWeHaul />} />
        <Route path="drive" element={<DriveWithUs />} />
        <Route path="safety" element={<Safety />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="apply" element={<ApplyPage />} />
        <Route path="apply/thanks" element={<ThankYouPage />} />
      </Route>
      <Route path="admin">
        <Route index element={<AdminLogin />} />
        <Route path="forgot" element={<ForgotPassword />} />
        <Route path="set-password/:token" element={<SetPassword />} />
        <Route element={<AdminLayout />}>
          <Route path="applicants" element={<ApplicantsPage />} />
          <Route path="applicants/:id" element={<ApplicantDetail />} />
          <Route path="team" element={<TeamPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
