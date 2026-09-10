export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    status: "ok",
    service: "research-topic-validation-web",
    workspaceId: process.env.RESEARCH_WORKSPACE_ID ?? null,
    protocolVersion: 1,
  });
}
