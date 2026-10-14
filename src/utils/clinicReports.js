import {
  DENTISTS,
  TREATMENTS,
} from "../data/clinicData.js";

export const REPORT_PERIODS = [
  {
    id: "all",
    label: "All Dates",
  },
  {
    id: "next7",
    label: "Next 7 Days",
  },
  {
    id: "next30",
    label: "Next 30 Days",
  },
  {
    id: "next90",
    label: "Next 90 Days",
  },
  {
    id: "past30",
    label: "Past 30 Days",
  },
];

export function localDateKey(date = new Date()) {
  const y = date.getFullYear();

  const m = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const d = String(
    date.getDate()
  ).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

export function shiftDate(days, source = new Date()) {
  const date = new Date(source);

  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);

  return localDateKey(date);
}

export function getTreatment(id) {
  return TREATMENTS.find(
    (item) => item.id === id
  );
}

export function getDentist(id) {
  return DENTISTS.find(
    (item) => item.id === id
  );
}

export function filterByPeriod(
  requests,
  period = "all"
) {
  const today = localDateKey();

  const day7 = shiftDate(6);
  const day30 = shiftDate(29);
  const day90 = shiftDate(89);
  const past30 = shiftDate(-29);

  return requests.filter((request) => {
    const date = request.date;

    if (typeof date !== "string") {
      return false;
    }

    switch (period) {
      case "next7":
        return date >= today && date <= day7;

      case "next30":
        return date >= today && date <= day30;

      case "next90":
        return date >= today && date <= day90;

      case "past30":
        return date >= past30 && date <= today;

      default:
        return true;
    }
  });
}

export function getReportStats(requests) {
  const today = localDateKey();

  return {
    total: requests.length,

    active: requests.filter(
      (item) => item.status === "requested"
    ).length,

    cancelled: requests.filter(
      (item) => item.status === "cancelled"
    ).length,

    upcoming: requests.filter(
      (item) =>
        item.status === "requested" &&
        item.date >= today
    ).length,

    today: requests.filter(
      (item) =>
        item.status === "requested" &&
        item.date === today
    ).length,
  };
}

export function getNext14Days(requests) {
  return Array.from(
    { length: 14 },
    (_, index) => {
      const day = shiftDate(index);

      const date = new Date(
        `${day}T12:00:00`
      );

      return {
        date: day,
        label: date.toLocaleDateString(
          "en-PH",
          {
            month: "short",
            day: "numeric",
          }
        ),
        count: requests.filter(
          (item) =>
            item.status === "requested" &&
            item.date === day
        ).length,
      };
    }
  );
}

export function getServiceDemand(requests) {
  return TREATMENTS.map((service) => {
    const all = requests.filter(
      (item) =>
        item.serviceId === service.id
    );

    const active = all.filter(
      (item) =>
        item.status === "requested"
    );

    return {
      id: service.id,
      name: service.name,
      category: service.category,
      image: service.image,
      total: all.length,
      active: active.length,
      cancelled: all.length - active.length,
      rate: service.priceFrom,
    };
  }).sort(
    (a, b) =>
      b.active - a.active ||
      b.total - a.total
  );
}

export function getDentistDemand(requests) {
  return DENTISTS.map((doctor) => {
    const matching = requests.filter(
      (item) =>
        item.doctorId === doctor.id
    );

    return {
      id: doctor.id,
      name: doctor.name,
      role: doctor.role,
      image: doctor.image,

      total: matching.length,

      active: matching.filter(
        (item) =>
          item.status === "requested"
      ).length,
    };
  }).sort(
    (a, b) =>
      b.active - a.active ||
      b.total - a.total
  );
}

export function csvCell(value) {
  let text = String(value ?? "");

  // Defend against spreadsheet formula injection.
  if (/^\s*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

export function downloadFile(
  content,
  filename,
  type
) {
  const blob = new Blob(
    [content],
    { type }
  );

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  // Allow the browser to start the download
  // before releasing the temporary object URL.
  window.setTimeout(
    () => URL.revokeObjectURL(url),
    1000
  );
}

export function exportAppointmentCSV(
  requests,
  filename = "your-smile-appointments.csv"
) {
  const headers = [
    "Reference",
    "Demo Alias",
    "Treatment",
    "Dentist",
    "Appointment Date",
    "Appointment Time",
    "Status",
    "Created At",
  ];

  const rows = requests.map((item) => [
    item.id,
    item.alias,
    getTreatment(item.serviceId)?.name || "",
    getDentist(item.doctorId)?.name || "",
    item.date,
    item.time,
    item.status,
    item.createdAt || "",
  ]);

  const csv = [
    headers.map(csvCell).join(","),
    ...rows.map(
      (row) =>
        row.map(csvCell).join(",")
    ),
  ].join("\r\n");

  downloadFile(
    "\uFEFF" + csv,
    filename,
    "text/csv;charset=utf-8"
  );
}