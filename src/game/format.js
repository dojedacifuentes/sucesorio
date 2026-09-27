// Formato y lectura de cantidades en español de Chile.

const nf = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 2 });

export function formatAmount(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return nf.format(value);
}

/**
 * Lee lo que escribió el jugador. Distingue ausencia de respuesta de un cero
 * válido y acepta formato chileno (1.234,5) o punto decimal (18.75).
 * @returns {{ status: "empty" } | { status: "invalid", raw: string } | { status: "ok", value: number }}
 */
export function parseAmount(input) {
  const raw = String(input ?? "").trim().replace(/\s+/g, "").replace(/^\$/, "");
  if (raw === "") return { status: "empty" };
  if (!/^-?[\d.,]+$/.test(raw)) return { status: "invalid", raw };
  let normalized;
  const hasDot = raw.includes(".");
  const hasComma = raw.includes(",");
  if (hasDot && hasComma) {
    // 1.234,56 → miles con punto, decimales con coma.
    if (raw.lastIndexOf(",") < raw.lastIndexOf(".")) return { status: "invalid", raw };
    normalized = raw.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    if ((raw.match(/,/g) ?? []).length > 1) return { status: "invalid", raw };
    normalized = raw.replace(",", ".");
  } else if (hasDot) {
    // 1.200 o 12.500.000 → miles; 18.75 → decimal.
    normalized = /^-?\d{1,3}(\.\d{3})+$/.test(raw) ? raw.replace(/\./g, "") : raw;
    if ((normalized.match(/\./g) ?? []).length > 1) return { status: "invalid", raw };
  } else {
    normalized = raw;
  }
  const value = Number(normalized);
  if (!Number.isFinite(value)) return { status: "invalid", raw };
  return { status: "ok", value };
}

/**
 * Compara una cantidad con la esperada. La tolerancia es absoluta y se
 * expresa en la unidad del ejercicio (por defecto, un centésimo).
 */
export function checkAmount(input, expected, tolerance = 0.01) {
  const parsed = parseAmount(input);
  if (parsed.status !== "ok") return { ...parsed, ok: false };
  const diff = Math.abs(parsed.value - expected);
  return { ...parsed, ok: diff <= tolerance + Number.EPSILON, diff };
}

/** Quita el veredicto con que empiezan algunos textos del banco ("Correcto.", "Incorrecto."). */
export function stripVerdict(text) {
  return String(text ?? "")
    .replace(/^\s*(¡?correcto!?|¡?incorrecto!?|orden incorrecto)[.:,]?\s*/i, "")
    .trim();
}

export function normalizeAnswer(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

/** Divide un texto en oraciones sin perder caracteres. */
export function splitSentences(text) {
  const source = String(text ?? "").trim();
  if (!source) return [];
  const parts = source.match(/\s*[^.!?…]+(?:[.!?…]+["»”)]*|$)/g) ?? [source];
  const out = [];
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const glued = !/^\s/.test(part);
    const prev = out[out.length - 1];
    if (prev && glued && /\d\.$/.test(prev) && /^\d/.test(trimmed)) {
      // 12.08.2088 o 1.500 no cortan la oración.
      out[out.length - 1] = `${prev}${trimmed}`;
    } else if (prev && /\b(arts?|inc|N[º°]|núm|pág|ss|Sr|Sra|aprox|etc)\.$/i.test(prev) && /^[\da-záéíóúñ(]/.test(trimmed)) {
      // "art. 984" o "arts. 988 a 995" tampoco.
      out[out.length - 1] = `${prev} ${trimmed}`;
    } else {
      out.push(trimmed);
    }
  }
  return out;
}

export function articleLabel(article) {
  const text = String(article ?? "").trim();
  if (!text) return "";
  if (/^arts?\./i.test(text) || /[a-z]/i.test(text.replace(/ss\.?$/, ""))) return text;
  return text.includes("/") || text.includes(" a ") ? `arts. ${text}` : `art. ${text}`;
}
