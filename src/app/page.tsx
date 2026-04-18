import { CoverageToCareDashboard } from "@/components/CoverageToCareDashboard";
import { getProviders, getSampleCases } from "@/lib/data";

export default function Page() {
  return (
    <CoverageToCareDashboard
      providers={getProviders()}
      sampleCases={getSampleCases()}
    />
  );
}
