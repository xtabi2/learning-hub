import { redirect } from "next/navigation";
import { DemoBanner } from "@/components/DemoBanner";
import { Disclaimer } from "@/components/Disclaimer";
import { HubChildBridge } from "@/components/HubChildBridge";
import { LaunchTowerHome } from "@/components/LaunchTowerHome";
import { resolveTowerCovers } from "@/lib/launchTowerArt";
import { requireChildForParent, requireUser } from "@/lib/auth";
import { getAdventureSnapshot } from "@/lib/adventureStore";

/**
 * Kid homepage = Launch Tower book picker. Map + Star Nook live only inside
 * the Ship HUD while reading GlowTrails — not on this home entry.
 */
export default async function PlayPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const user = await requireUser();
  const child = await requireChildForParent(childId, user.userId);

  if (!child.placementCompleted) {
    redirect(`/play/${childId}/placement`);
  }

  const adventure = await getAdventureSnapshot(childId);

  return (
    <div className="kid-shell kid-shell-launch-tower">
      {child.isDemo ? <DemoBanner /> : null}
      <Disclaimer oneLine />
      <HubChildBridge
        portalChildName={child.name}
        storyReadingBand={adventure.storyReadingBand}
        partsCollected={adventure.partsCollected}
        readyToLeave={adventure.readyToLeave}
      />
      <LaunchTowerHome
        childId={childId}
        childName={child.name}
        band={adventure.storyReadingBand}
        isDemo={child.isDemo}
        covers={resolveTowerCovers()}
      />
    </div>
  );
}
