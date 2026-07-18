import { ExpandableDesc } from "@/components/house/ExpandableDesc";
import { FileItem } from "@/components/house/FileItem";
import { MascotLogo } from "@/components/house/MascotLogo";
import { db } from "@/db";
import { student } from "@/db/schema";
import { HOUSE_META, HOUSES, type House } from "@/lib/constants/houses";
import { toPublicStudent } from "@/lib/mappers";
import type { PublicStudent } from "@/types";
import { and, asc, eq, isNull, sql } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

const ROLE_LABELS: Record<PublicStudent["role"], string> = {
  house_leader: "HOUSE LEADER",
  senior: "SENIOR",
  junior: "JUNIOR",
};

function isHouse(value: string): value is House {
  return (HOUSES as readonly string[]).includes(value);
}

function StudentCard({
  agent,
  index,
}: {
  agent: PublicStudent;
  index: number;
}) {
  const meta = HOUSE_META[agent.house];
  const [r, g, b] = meta.rgb;
  const isLeader = agent.role === "house_leader";
  const isSenior = agent.role === "senior";
  const code =
    (isLeader ? "LDR" : isSenior ? "SR" : "JR") +
    "-" +
    agent.studentId.slice(-2);

  return (
    <FileItem
      href={`/agent/${agent.id}`}
      color={meta.color}
      index={index}
      badgeLabel={code}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 shrink-0 flex items-center justify-center overflow-hidden bg-background"
          style={{ border: `2px solid rgba(${r},${g},${b},0.3)` }}
        >
          <Image
            src={agent.profileUrl || "/detective-conan-pfp.png"}
            alt={`${agent.displayName} profile`}
            width={48}
            height={48}
            unoptimized
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-display text-[13px] text-foreground leading-[1.3]">
            {agent.nickname || "-"}
          </div>
          <div className="text-xs text-muted mt-1">
            <span className="font-semibold" style={{ color: meta.color }}>
              {agent.displayName}
            </span>
          </div>
        </div>

        <div className="text-lg text-subtle">›</div>
      </div>
    </FileItem>
  );
}

export default async function HousePage({
  params,
}: {
  params: Promise<{ house: string }>;
}) {
  const { house: houseParam } = await params;
  if (!isHouse(houseParam)) notFound();

  const house = houseParam;
  const meta = HOUSE_META[house];
  const [r, g, b] = meta.rgb;
  const [descFirst, ...descRestParts] = meta.desc.split(/\n\s*\n/);
  const descRest = descRestParts.join("\n\n");

  const rows = await db
    .select()
    .from(student)
    .where(and(eq(student.house, house), isNull(student.deletedAt)))
    .orderBy(
      sql`case ${student.role} when 'house_leader' then 0 when 'senior' then 1 else 2 end`,
      asc(student.displayName),
    );

  const members = rows.map(toPublicStudent);
  const leaders = members.filter((m) => m.role === "house_leader");
  const seniors = members.filter((m) => m.role === "senior");
  const juniors = members.filter((m) => m.role === "junior");

  return (
    <div className="min-h-screen bg-background flex flex-col font-serif">
      <main className="flex-1 overflow-y-auto">
        {/* Hero banner */}
        <div
          className="relative overflow-hidden"
          style={{ background: meta.color }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(color-mix(in srgb,var(--color-background) 4%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--color-background) 4%,transparent) 1px,transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg,color-mix(in srgb,var(--color-background) 6%,transparent),transparent 60%)",
            }}
          />

          <div className="relative max-w-content mx-auto px-5 pt-6 pb-12 flex flex-col items-center text-center">
            <div
              className="self-start border border-background/25 px-2 py-0.5 mb-3.5"
              style={{ animation: "stampIn 0.7s ease-out both" }}
            >
              <div className="text-[7px] text-background/50 tracking-[3px] font-mono">
                DIVISION DOSSIER
              </div>
            </div>

            <div className="flex items-center gap-4 w-full">
              <MascotLogo url={meta.mascot} name={meta.name} />
              <div className="flex-col justify-start text-left">
                <div className="font-display text-2xl text-background leading-[1.15] mb-2">
                  {meta.name}
                </div>
                <div className="text-base text-background/70 tracking-[2px] uppercase font-mono leading-4">
                  {meta.tagline}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Division summary — torn evidence card overlapping the hero */}
        <div className="relative -mt-[30px] max-w-content mx-auto px-4">
          <div className="bg-surface px-3 pt-4 pb-3 shadow-[3px_4px_0_rgba(0,0,0,0.12)] torn-bottom">
            <div className="absolute top-3.5 left-4 w-2 h-2 rounded-full bg-danger shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
            <div className="absolute top-3.5 right-4 w-2 h-2 rounded-full bg-danger shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
            <div className="flex gap-2 flex-wrap mb-3 justify-center">
              <div
                className="px-2 py-0.5 text-[8px] tracking-[1px] font-mono"
                style={{
                  background: `rgba(${r},${g},${b},0.1)`,
                  border: `1px solid rgba(${r},${g},${b},0.3)`,
                  color: meta.color,
                }}
              >
                {members.length} AGENTS
              </div>
              <div className="px-2 py-0.5 bg-success/10 border border-success/30 text-[8px] text-success tracking-[1px] font-mono">
                ACTIVE
              </div>
            </div>
            <ExpandableDesc
              first={descFirst}
              rest={descRest}
              color={meta.color}
            />
          </div>
        </div>

        {/* Division Leaders */}
        <div className="max-w-content mx-auto px-4 my-8">
          <div className="text-[8px] text-danger tracking-[4px] uppercase mb-3 font-mono">
            DIVISION LEADERS
          </div>
          <div className="flex flex-col gap-4 mb-5">
            {leaders.map((agent, index) => (
              <StudentCard
                key={agent.id}
                agent={agent}
                index={index}
                // delayMs={index * 60}
              />
            ))}
          </div>
        </div>

        {/* Senior Operatives */}

        <div className="max-w-content mx-auto px-4 my-8">
          <div className="text-[8px] text-danger tracking-[4px] uppercase mb-3 font-mono">
            SENIOR OPERATIVES
          </div>
          <div className="flex flex-col gap-4">
            {seniors.length > 0 ? (
              seniors.map((agent, index) => (
                <StudentCard
                  key={agent.id}
                  agent={agent}
                  index={index}
                  // delayMs={120 + index * 60}
                />
              ))
            ) : (
              <div className="bg-surface border border-dark/8 p-3.5 text-muted text-[13px] font-serif">
                No senior operatives on file yet.
              </div>
            )}
          </div>
        </div>

        {/* Junior Operatives */}
        <div className="max-w-content mx-auto px-4 my-6">
          <div className="text-[8px] text-muted-fg tracking-[4px] uppercase mb-3 font-mono">
            JUNIOR OPERATIVES
          </div>
          <div className="flex flex-col gap-4">
            {juniors.length > 0 ? (
              juniors.map((agent, index) => (
                <StudentCard
                  key={agent.id}
                  agent={agent}
                  index={index}
                  // delayMs={200 + index * 50}
                />
              ))
            ) : (
              <div className="bg-surface border border-dark/8 p-3.5 text-muted text-[13px] font-serif">
                No junior operatives on file yet.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
