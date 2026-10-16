import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

/*
  YOUR SMILE. — FINAL ARCHITECTURAL QA

  Run from the project root:
    node scripts/qa-smile-final.mjs

  Read-only checks. This script never modifies the project,
  appointments, localStorage, or browser data.
*/

const ROOT = process.cwd();
const require = createRequire(import.meta.url);

const passes = [];
const failures = [];
const warnings = [];

/* ==========================================
   REPORT HELPERS
========================================== */

function pass(message) {
  passes.push(message);
}

function fail(message) {
  failures.push(message);
}

function check(title, run) {
  try {
    run();
    pass(title);
  } catch (error) {
    fail(`${title}: ${error.message}`);
  }
}

function filePath(relative) {
  return path.join(ROOT, relative);
}

function exists(relative) {
  return fs.existsSync(filePath(relative));
}

function read(relative) {
  return fs.readFileSync(
    filePath(relative),
    "utf8"
  );
}

/* ==========================================
   IMPORT RESOLUTION
========================================== */

function resolveRelativeImport(
  fromFile,
  importedPath
) {
  const base = path.resolve(
    path.dirname(fromFile),
    importedPath
  );

  return [
    base,
    `${base}.js`,
    `${base}.jsx`,
    `${base}.mjs`,
    `${base}.css`,
    `${base}.json`,
    path.join(base, "index.js"),
    path.join(base, "index.jsx"),
  ].some((candidate) =>
    fs.existsSync(candidate)
  );
}

/* ==========================================
   01 / REQUIRED PROJECT FILES
========================================== */

const REQUIRED_FILES = [
  "src/main.jsx",
  "src/App.jsx",

  "src/data/clinicData.js",
  "src/data/treatmentEditorial.js",
  "src/data/dentistEditorial.js",

  "src/utils/clinicReports.js",

  "src/components/SiteEnhancements.jsx",
  "src/components/StaffLayout.jsx",
  "src/components/SmileRouteQuality.jsx",
  "src/components/AppErrorBoundary.jsx",

  "src/pages/SmileAtelierHome.jsx",
  "src/pages/TreatmentCollectionPage.jsx",
  "src/pages/TreatmentDetailsPage.jsx",
  "src/pages/DentistCollectionPage.jsx",
  "src/pages/DentistProfilePage.jsx",
  "src/pages/AppointmentCalendarPage.jsx",
  "src/pages/AppointmentManagementPage.jsx",

  ...[
    "DashboardPage",
    "AppointmentDeskPage",
    "DentistSchedulesPage",
    "TreatmentManagementPage",
    "ReportsPage",
    "TreatmentInsightsPage",
    "ClinicSettingsPage",
    "DataCenterPage",
    "DataVaultPage",
  ].map(
    (name) =>
      `src/pages/staff/${name}.jsx`
  ),

  "src/styles/smile-atelier.css",
  "src/styles/smile-treatments-architectural.css",
  "src/styles/smile-people-architectural.css",
  "src/styles/smile-staff-batch4.css",
  "src/styles/smile-staff-batch5.css",
  "src/styles/smile-final-polish.css",
];

const missingFiles = REQUIRED_FILES.filter(
  (name) => !exists(name)
);

if (missingFiles.length) {
  for (const name of missingFiles) {
    fail(`Missing required file: ${name}`);
  }
} else {
  pass(
    `${REQUIRED_FILES.length} required project files found`
  );
}

/* ==========================================
   02 / PARSER DEPENDENCIES
========================================== */

let babel = null;
let postcss = null;

try {
  babel = require("@babel/parser");
} catch {
  fail(
    "@babel/parser is unavailable. Run npm install."
  );
}

try {
  postcss = require("postcss");
} catch {
  fail(
    "postcss is unavailable. Run npm install."
  );
}

/* ==========================================
   03 / COLLECT SOURCE FILES
========================================== */

function walk(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const found = [];

  for (const entry of fs.readdirSync(
    dir,
    { withFileTypes: true }
  )) {
    const full = path.join(
      dir,
      entry.name
    );

    if (entry.isDirectory()) {
      found.push(...walk(full));
    } else if (
      /\.(js|jsx|mjs|css)$/.test(
        entry.name
      )
    ) {
      found.push(full);
    }
  }

  return found;
}

let jsCount = 0;
let cssCount = 0;
let importCount = 0;

const lucideImports = new Set();

/* ==========================================
   04 / INSPECT IMPORTS
========================================== */

function inspectImport(
  from,
  imported,
  specifiers = []
) {
  if (imported.startsWith(".")) {
    importCount += 1;

    if (
      !resolveRelativeImport(
        from,
        imported
      )
    ) {
      fail(
        `Unresolved import: ${
          path.relative(ROOT, from)
        } -> ${imported}`
      );
    }
  }

  if (imported === "lucide-react") {
    for (const spec of specifiers) {
      if (
        spec.type ===
        "ImportSpecifier"
      ) {
        lucideImports.add(
          spec.imported.name ??
            spec.imported.value
        );
      }
    }
  }
}

/* ==========================================
   05 / JAVASCRIPT, JSX AND CSS CHECKS
========================================== */

for (const filename of walk(
  filePath("src")
)) {
  const source = fs.readFileSync(
    filename,
    "utf8"
  );

  const relative = path.relative(
    ROOT,
    filename
  );

  try {
    if (filename.endsWith(".css")) {
      if (!postcss) {
        continue;
      }

      postcss.parse(source, {
        from: filename,
      });

      cssCount += 1;

      continue;
    }

    if (!babel) {
      continue;
    }

    const ast = babel.parse(source, {
      sourceType: "module",
      plugins: ["jsx"],
      errorRecovery: false,
    });

    jsCount += 1;

    for (const item of ast.program.body) {
      const supported = [
        "ImportDeclaration",
        "ExportNamedDeclaration",
        "ExportAllDeclaration",
      ];

      if (
        supported.includes(item.type) &&
        item.source?.value
      ) {
        inspectImport(
          filename,
          item.source.value,
          item.specifiers ?? []
        );
      }
    }

    /* Check dynamic imports */

    const dynamicPattern =
      /import\(\s*["'](\.[^"']+)["']\s*\)/g;

    for (const match of source.matchAll(
      dynamicPattern
    )) {
      inspectImport(
        filename,
        match[1]
      );
    }
  } catch (error) {
    fail(
      `Syntax error in ${relative}: ${
        error.message
      }`
    );
  }
}

if (babel) {
  pass(
    `${jsCount} JavaScript / JSX files parsed`
  );
}

if (postcss) {
  pass(
    `${cssCount} stylesheets parsed`
  );
}

pass(
  `${importCount} relative imports checked`
);

/* ==========================================
   06 / LUCIDE ICON CHECK
========================================== */

try {
  const lucide = await import(
    "lucide-react"
  );

  const invalid = [
    ...lucideImports,
  ].filter(
    (name) => !(name in lucide)
  );

  if (invalid.length) {
    fail(
      `Unavailable Lucide icon exports: ${
        invalid.join(", ")
      }`
    );
  } else {
    pass(
      `${lucideImports.size} Lucide icon exports verified`
    );
  }
} catch (error) {
  fail(
    `Lucide verification could not run: ${
      error.message
    }`
  );
}

/* ==========================================
   07 / STAFF DEMO & ROUTE CHECKS
========================================== */

if (exists("src/App.jsx")) {
  const app = read("src/App.jsx");

  /* STAFF DEMO */

  check(
    "Staff Demo button opens the dashboard route",
    () => {
      assert.match(
        app,
        /className\s*=\s*["']sm4-staff-access["']/
      );

      assert.match(
        app,
        /to\s*=\s*["']\/staff["']/
      );

      assert.match(
        app,
        /STAFF DEMO/
      );
    }
  );

  /* STAFF ROUTES */

  check(
    "Dashboard and all seven staff subroutes exist",
    () => {
      assert.match(
        app,
        /path\s*=\s*["']staff["']/
      );

      assert.match(
        app,
        /StaffDashboardPage/
      );

      for (const route of [
        "appointments",
        "schedules",
        "treatments",
        "reports",
        "insights",
        "settings",
        "data",
      ]) {
        assert.match(
          app,
          new RegExp(
            `path\\s*=\\s*["']${route}["']`
          )
        );
      }
    }
  );

  /* ========================================
     FIXED APPOINTMENT CALLBACK CHECK

     Accepts:
       onCreateRequest={createRequest}

     And:
       onCreateRequest={
         createRequest
       }

     No duplicate block.
  ======================================== */

  check(
    "Calendar and staff share the original request callbacks",
    () => {
      assert.match(
        app,
        /onCreateRequest\s*=\s*\{\s*createRequest\s*\}/
      );

      assert.match(
        app,
        /onReplaceRequests\s*=\s*\{\s*setRequests\s*\}/
      );

      assert.match(
        app,
        /onCancelRequest\s*=\s*\{\s*cancelRequest\s*\}/
      );

      assert.match(
        app,
        /your-smile-demo-requests-v1/
      );
    }
  );

  /* BOOKING VALIDATION */

  check(
    "Booking logic validates time slots and prevents collisions",
    () => {
      assert.match(
        app,
        /TIME_SLOTS\s*\.\s*includes\s*\(\s*input\.time\s*\)/
      );

      assert.match(
        app,
        /item\.status\s*===\s*["']requested["']/
      );

      assert.match(
        app,
        /item\.doctorId\s*===\s*input\.doctorId/
      );
    }
  );

  /* DEVELOPER CREDIT */

  check(
    "Developer credit is preserved",
    () => {
      assert.match(
        read(
          "src/data/clinicData.js"
        ),
        /Website Concept Made by: Web Developer Devin Planas/
      );
    }
  );
}

/* ==========================================
   08 / HASH ROUTER AND FINAL POLISH
========================================== */

if (exists("src/main.jsx")) {
  check(
    "HashRouter and final polish are installed",
    () => {
      const entry = read(
        "src/main.jsx"
      );

      assert.match(
        entry,
        /HashRouter/
      );

      assert.match(
        entry,
        /SmileRouteQuality/
      );

      assert.match(
        entry,
        /smile-final-polish\.css/
      );
    }
  );
}

/* ==========================================
   09 / SETTINGS AND DATA BACKUP
========================================== */

if (
  exists(
    "src/pages/staff/DataCenterPage.jsx"
  ) &&
  exists(
    "src/pages/staff/ClinicSettingsPage.jsx"
  )
) {
  check(
    "Settings and backups use the same profile draft key",
    () => {
      const key =
        "your-smile-clinic-profile-draft-v1";

      assert.ok(
        read(
          "src/pages/staff/DataCenterPage.jsx"
        ).includes(key)
      );

      assert.ok(
        read(
          "src/pages/staff/ClinicSettingsPage.jsx"
        ).includes(key)
      );
    }
  );
}

/* ==========================================
   10 / TREATMENT AND REPORT TESTS
========================================== */

if (
  exists("src/data/clinicData.js") &&
  exists(
    "src/data/treatmentEditorial.js"
  ) &&
  exists(
    "src/utils/clinicReports.js"
  )
) {
  try {
    const config = await import(
      pathToFileURL(
        filePath(
          "src/data/clinicData.js"
        )
      ).href
    );

    const editorial = await import(
      pathToFileURL(
        filePath(
          "src/data/treatmentEditorial.js"
        )
      ).href
    );

    const reports = await import(
      pathToFileURL(
        filePath(
          "src/utils/clinicReports.js"
        )
      ).href
    );

    /* TREATMENT VALIDATION */

    check(
      "All treatments have unique IDs and editorial information",
      () => {
        assert.ok(
          Array.isArray(
            config.TREATMENTS
          )
        );

        assert.ok(
          config.TREATMENTS.length > 0
        );

        assert.equal(
          new Set(
            config.TREATMENTS.map(
              (item) => item.id
            )
          ).size,
          config.TREATMENTS.length
        );

        assert.ok(
          Array.isArray(
            config.TIME_SLOTS
          ) &&
            config.TIME_SLOTS.length > 0
        );

        for (
          const item of config.TREATMENTS
        ) {
          assert.ok(
            editorial.TREATMENT_EDITORIAL[
              item.id
            ],
            item.id
          );

          assert.ok(
            item.priceFrom >= 0
          );
        }
      }
    );

    /* REQUEST STATUS TEST */

    check(
      "Requested and cancelled reports count correctly",
      () => {
        const service =
          config.TREATMENTS[0];

        const doctor =
          config.DENTISTS[0];

        const sample = [
          {
            id: "QA-1",
            serviceId: service.id,
            doctorId: doctor.id,
            date: reports.shiftDate(3),
            time: config.TIME_SLOTS[0],
            status: "requested",
          },
          {
            id: "QA-2",
            serviceId: service.id,
            doctorId: doctor.id,
            date: reports.shiftDate(4),
            time: config.TIME_SLOTS[1],
            status: "cancelled",
          },
        ];

        const stats =
          reports.getReportStats(
            sample
          );

        assert.equal(
          stats.total,
          2
        );

        assert.equal(
          stats.active,
          1
        );

        assert.equal(
          stats.cancelled,
          1
        );

        assert.equal(
          stats.upcoming,
          1
        );

        const serviceDemand =
          reports
            .getServiceDemand(sample)
            .find(
              (item) =>
                item.id === service.id
            );

        assert.equal(
          serviceDemand?.total,
          2
        );
      }
    );

    /* CSV SECURITY */

    check(
      "CSV exporter escapes spreadsheet formulas",
      () => {
        assert.ok(
          reports
            .csvCell(
              '=HYPERLINK("x")'
            )
            .startsWith(
              "\"'="
            )
        );
      }
    );
  } catch (error) {
    fail(
      `Unable to run data regression tests: ${
        error.message
      }`
    );
  }
}

/* ==========================================
   11 / FINAL QUALITY REPORT
========================================== */

console.log(
  "\nYOUR SMILE. — BATCH 6 QUALITY REPORT"
);

console.log(
  "═".repeat(44)
);

for (const message of passes) {
  console.log(
    `PASS  ${message}`
  );
}

for (const message of warnings) {
  console.log(
    `WARN  ${message}`
  );
}

for (const message of failures) {
  console.log(
    `FAIL  ${message}`
  );
}

console.log(
  "─".repeat(44)
);

console.log(
  `${passes.length} passes, ${warnings.length} warnings, ${failures.length} failures`
);

console.log(
  "NEXT: npm run build + manual browser testing at 320/375/768/1024/1440px."
);

if (failures.length) {
  process.exitCode = 1;
}