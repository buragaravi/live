import { ConsentPage } from "@/components/consent-page";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function LinkPage({ params }: Props) {
  const { slug } = await params;
  return <ConsentPage slug={slug} />;
}
