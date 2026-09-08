import { expect, test } from "@playwright/test";

test("topic, evidence, actions and mobile layout", async ({
  page,
}, testInfo) => {
  await page.route("**/v1/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    const gap = {
      id: "gap",
      projectId: "project",
      gapText: "AI and design",
      status: "DRAFT",
      createdAt: "2026-09-08",
    };
    let response: unknown;
    if (path === "/v1/projects")
      response = {
        id: "project",
        title: "AI and design",
        createdAt: "2026-09-08",
      };
    else if (path.endsWith("/gaps")) response = { gap, conditions: [] };
    else if (path.endsWith("/search-runs"))
      response = {
        id: "search",
        gapId: "gap",
        resultCount: 1,
        sourceScope: {},
        querySnapshot: {},
        createdAt: "2026-09-08",
        results: [],
      };
    else if (path.endsWith("/evidence"))
      response = {
        gapId: "gap",
        items: [
          {
            id: "evidence",
            gapId: "gap",
            paper: {
              id: "paper",
              title:
                "Generative AI and idea diversity in professional design practice",
              publicationYear: 2025,
            },
            overlapGrade: "P1",
            strength: 0.4,
            matchedConditions: ["design"],
            mismatchedConditions: ["education"],
            roles: [],
            passages: [
              {
                id: "passage",
                paperId: "paper",
                passageText: "Study abstract for detailed evidence review.",
              },
            ],
          },
        ],
      };
    else if (path.endsWith("/review")) response = { gapId: "gap", gates: [] };
    else return route.abort();
    await route.fulfill({ json: response });
  });
  await page.goto("/");
  await expect(page.getByRole("textbox")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "선행연구 검토 시작" }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("topic-entry.png"),
    fullPage: true,
  });
  await page.getByRole("textbox").fill("AI and design");
  await page.getByRole("button", { name: "선행연구 검토 시작" }).click();
  await expect(
    page.getByRole("heading", { name: "AI and design" }),
  ).toBeVisible();
  await expect(
    page.getByText("Study abstract for detailed evidence review."),
  ).toBeHidden();
  await page.getByText("초록과 비교 근거").click();
  await expect(
    page.getByText("Study abstract for detailed evidence review."),
  ).toBeVisible();
  await page.getByRole("button", { name: "연구 준비 점검하기" }).click();
  await expect(page.getByLabel("사용할 데이터와 접근 권한")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("review-results.png"),
    fullPage: true,
  });
});
