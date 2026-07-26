import { getCompany, getJob, getJobTypes, getProfile } from "@/lib/data";
import { notFound } from "next/navigation";
import JobPageClient from "./JobPageClient";

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();

  return (
    <JobPageClient
      job={job}
      company={getCompany(job.companyId) || null}
      profile={getProfile()}
      jobTypes={getJobTypes()}
    />
  );
}
