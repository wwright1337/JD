import { useState, useRef, useEffect } from "react";
import { supabase } from "./supabaseClient";

const ink = "#12141C";
const surface = "#1B1E29";
const surface2 = "#242837";
const border = "#2E3140";
const textPrimary = "#F3F4F7";
const textMuted = "#9098AC";
const amber = "#F5A623";
const amberDark = "#412402";
const green = "#3FB68A";
const red = "#E2857C";

const sans = "'Inter', system-ui, sans-serif";
const serif = "'Fraunces', Georgia, serif";

function Screen({ children }) {
  return (
    <div
      style={{
        width: 390,
        minHeight: 720,
        margin: "0 auto",
        background: ink,
        color: textPrimary,
        fontFamily: sans,
        borderRadius: 32,
        border: `1px solid ${border}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  );
}

function TopBar({ label }) {
  return (
    <div
      style={{
        padding: "18px 20px 14px",
        borderBottom: `1px solid ${border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontFamily: serif, fontSize: 20, letterSpacing: 0.2 }}>
        Just Drink
      </div>
      <div style={{ fontSize: 12, color: textMuted }}>{label}</div>
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "14px 16px",
        borderRadius: 12,
        border: "none",
        background: disabled ? surface2 : amber,
        color: disabled ? textMuted : "#2B1800",
        fontWeight: 600,
        fontSize: 15,
        fontFamily: sans,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "opacity 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "12px 16px",
        borderRadius: 12,
        border: `1px solid ${border}`,
        background: "transparent",
        color: textPrimary,
        fontWeight: 500,
        fontSize: 14,
        fontFamily: sans,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function Field({ label, value, onChange, placeholder, half }) {
  return (
    <div style={{ flex: half ? "1 1 0" : "1 1 100%" }}>
      <div style={{ fontSize: 12, color: textMuted, marginBottom: 6 }}>
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "10px 12px",
          borderRadius: 10,
          border: `1px solid ${border}`,
          background: surface2,
          color: textPrimary,
          fontSize: 14,
          fontFamily: sans,
          outline: "none",
        }}
      />
    </div>
  );
}

function Checkbox({ checked, onChange, children }) {
  return (
    <label
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        cursor: "pointer",
        padding: "10px 0",
      }}
    >
      <div
        onClick={() => onChange(!checked)}
        style={{
          marginTop: 2,
          width: 18,
          height: 18,
          flexShrink: 0,
          borderRadius: 5,
          border: `1.5px solid ${checked ? amber : border}`,
          background: checked ? amber : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {checked && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path
              d="M1 4.5L4 7.5L10 1.5"
              stroke="#2B1800"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span style={{ fontSize: 13, lineHeight: 1.5, color: "#D6D9E2" }}>
        {children}
      </span>
    </label>
  );
}

function SignaturePad({ onSignatureChange }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const hasDrawn = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#F3F4F7";
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const pos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  };

  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    const { x, y } = pos(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const { x, y } = pos(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
    if (!hasDrawn.current) {
      hasDrawn.current = true;
    }
  };

  const end = () => {
    drawing.current = false;
    if (hasDrawn.current) {
      onSignatureChange(true, canvasRef.current.toDataURL("image/png"));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawn.current = false;
    onSignatureChange(false, null);
  };

  return (
    <div>
      <div
        style={{
          borderRadius: 12,
          border: `1px dashed ${border}`,
          background: surface2,
          position: "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          width={342}
          height={110}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
          style={{ touchAction: "none", display: "block" }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 14,
            fontSize: 11,
            color: textMuted,
            pointerEvents: "none",
          }}
        >
          Sign above
        </div>
      </div>
      <button
        onClick={clear}
        style={{
          marginTop: 8,
          background: "none",
          border: "none",
          color: textMuted,
          fontSize: 12,
          cursor: "pointer",
          padding: 0,
        }}
      >
        Clear signature
      </button>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [vehicle, setVehicle] = useState({ make: "", model: "", plate: "", insurer: "" });
  const [checks, setChecks] = useState({ insured: false, authorize: false, roadworthy: false });
  const [signed, setSigned] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);
  const [signedAt, setSignedAt] = useState(null);
  const [tripId, setTripId] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const allChecked = checks.insured && checks.authorize && checks.roadworthy;
  const vehicleComplete = vehicle.make && vehicle.model && vehicle.plate;
  const canSubmit = allChecked && signed && vehicleComplete && !submitting;

  // Make sure there's a signed-in user before writing to Supabase.
  // Anonymous auth must be enabled in Supabase: Authentication > Providers > Anonymous.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) supabase.auth.signInAnonymously();
    });
  }, []);

  const onSignatureChange = (isSigned, dataUrl) => {
    setSigned(isSigned);
    setSignatureDataUrl(dataUrl);
  };

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      const { data: trip, error: tripError } = await supabase
        .from("trips")
        .insert({ rider_id: user.id, status: "awaiting_authorization" })
        .select()
        .single();
      if (tripError) throw tripError;

      const { error: authError } = await supabase.from("vehicle_authorizations").insert({
        trip_id: trip.id,
        make: vehicle.make,
        model: vehicle.model,
        plate: vehicle.plate,
        insurer: vehicle.insurer || null,
        insured_confirmed: checks.insured,
        roadworthy_confirmed: checks.roadworthy,
        authorization_confirmed: checks.authorize,
        signature_svg: signatureDataUrl
      });
      if (authError) throw authError;

      await supabase.from("trips").update({ status: "active" }).eq("id", trip.id);

      setTripId(trip.id);
      setSignedAt(new Date());
      setScreen("active");
    } catch (err) {
      setSubmitError(err.message || "Something went wrong saving your authorization.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        background: "var(--surface-1, #f4f4f2)",
        padding: "24px 0",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');
        input::placeholder { color: #6B7286; }
      `}</style>

      {screen === "home" && (
        <Screen>
          <TopBar label="Brick, NJ" />
          <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontFamily: serif, fontSize: 30, lineHeight: 1.15 }}>
                Get you and your car home.
              </div>
              <p style={{ color: textMuted, fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>
                A driver comes to you, drives your own car back, and you never leave it behind.
              </p>
            </div>

            <div
              style={{
                marginTop: 28,
                background: surface,
                border: `1px solid ${border}`,
                borderRadius: 16,
                padding: 18,
              }}
            >
              <div style={{ fontSize: 12, color: textMuted, marginBottom: 6 }}>Pickup</div>
              <div style={{ fontSize: 15, marginBottom: 14 }}>Current location</div>
              <div style={{ fontSize: 12, color: textMuted, marginBottom: 6 }}>Drop-off</div>
              <div style={{ fontSize: 15 }}>Home — 42 min away</div>
            </div>

            <div
              style={{
                marginTop: 16,
                display: "flex",
                gap: 10,
                fontSize: 12,
                color: textMuted,
              }}
            >
              <div style={{ flex: 1, background: surface, borderRadius: 10, padding: 12, border: `1px solid ${border}` }}>
                Estimated wait
                <div style={{ color: textPrimary, fontSize: 16, marginTop: 4 }}>9 min</div>
              </div>
              <div style={{ flex: 1, background: surface, borderRadius: 10, padding: 12, border: `1px solid ${border}` }}>
                Estimated fare
                <div style={{ color: textPrimary, fontSize: 16, marginTop: 4 }}>$38–44</div>
              </div>
            </div>

            <div style={{ flex: 1 }} />
            <PrimaryButton onClick={() => setScreen("finding")}>
              Request a driver
            </PrimaryButton>
          </div>
        </Screen>
      )}

      {screen === "finding" && (
        <Screen>
          <TopBar label="Finding a driver" />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: `3px solid ${border}`,
                borderTopColor: amber,
                animation: "spin 1s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ marginTop: 20, fontFamily: serif, fontSize: 18 }}>
              Matching you with a nearby driver
            </div>
            <div style={{ marginTop: 6, color: textMuted, fontSize: 13 }}>
              This usually takes under a minute.
            </div>
          </div>
          <div style={{ padding: 24 }}>
            <PrimaryButton onClick={() => setScreen("matched")}>
              Continue
            </PrimaryButton>
          </div>
        </Screen>
      )}

      {screen === "matched" && (
        <Screen>
          <TopBar label="Driver matched" />
          <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: amberDark,
                  color: amber,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: serif,
                  fontSize: 18,
                }}
              >
                JT
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 500 }}>Jordan T.</div>
                <div style={{ fontSize: 13, color: textMuted }}>4.96 · 2,140 trips · arriving in 7 min</div>
              </div>
            </div>

            <div
              style={{
                marginTop: 20,
                background: surface,
                border: `1px solid ${border}`,
                borderRadius: 16,
                padding: 18,
              }}
            >
              <div style={{ fontFamily: serif, fontSize: 16, marginBottom: 10 }}>
                Before Jordan drives your car
              </div>
              <p style={{ fontSize: 13, color: textMuted, lineHeight: 1.6, margin: 0 }}>
                Since Jordan will be operating your vehicle, Just Drink needs a quick
                authorization from you first — your vehicle details and a signature.
                It takes about a minute.
              </p>
            </div>

            <div style={{ flex: 1 }} />
            <PrimaryButton onClick={() => setScreen("consent")}>
              Authorize driver for my vehicle
            </PrimaryButton>
          </div>
        </Screen>
      )}

      {screen === "consent" && (
        <Screen>
          <TopBar label="Vehicle authorization" />
          <div style={{ padding: "20px 24px 8px", flex: 1, overflowY: "auto" }}>
            <div style={{ fontFamily: serif, fontSize: 20, marginBottom: 4 }}>
              Authorize Jordan T. to drive your car
            </div>
            <p style={{ fontSize: 12.5, color: textMuted, lineHeight: 1.6, marginTop: 4 }}>
              This confirms your vehicle's details and gives your driver
              permission to operate it for this trip only.
            </p>

            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <Field half label="Make" placeholder="Honda" value={vehicle.make} onChange={(v) => setVehicle({ ...vehicle, make: v })} />
                <Field half label="Model" placeholder="Accord" value={vehicle.model} onChange={(v) => setVehicle({ ...vehicle, model: v })} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Field half label="License plate" placeholder="ABC-1234" value={vehicle.plate} onChange={(v) => setVehicle({ ...vehicle, plate: v })} />
                <Field half label="Insurer (optional)" placeholder="State Farm" value={vehicle.insurer} onChange={(v) => setVehicle({ ...vehicle, insurer: v })} />
              </div>
            </div>

            <div
              style={{
                marginTop: 20,
                background: surface2,
                border: `1px solid ${border}`,
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div style={{ fontFamily: serif, fontSize: 14, marginBottom: 8 }}>
                Authorization terms
              </div>
              <p style={{ fontSize: 12, color: "#B7BCCB", lineHeight: 1.65, margin: 0 }}>
                By signing below, you authorize the assigned Just Drink driver to
                operate the vehicle described above for the sole purpose of
                transporting it and its occupants to the requested drop-off
                location. You confirm you are the vehicle's owner or an
                authorized user with the right to permit this, and that the
                vehicle is currently covered by valid insurance. This
                authorization ends automatically when the trip is completed or
                cancelled, and does not transfer ownership or any right to use
                the vehicle beyond this trip.
              </p>
            </div>

            <div style={{ marginTop: 4 }}>
              <Checkbox checked={checks.insured} onChange={(v) => setChecks({ ...checks, insured: v })}>
                My vehicle is currently covered by valid insurance.
              </Checkbox>
              <Checkbox checked={checks.roadworthy} onChange={(v) => setChecks({ ...checks, roadworthy: v })}>
                My vehicle is roadworthy and safe to drive tonight.
              </Checkbox>
              <Checkbox checked={checks.authorize} onChange={(v) => setChecks({ ...checks, authorize: v })}>
                I authorize Jordan T. to drive my vehicle for this trip only,
                and I release Just Drink from liability for damage arising from
                circumstances outside the driver's reasonable control.
              </Checkbox>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, color: textMuted, marginBottom: 8 }}>
                Signature
              </div>
              <SignaturePad onSignatureChange={onSignatureChange} />
            </div>

            <div style={{ height: 16 }} />
          </div>

          <div style={{ padding: "14px 24px 22px", borderTop: `1px solid ${border}` }}>
            {!canSubmit && !submitting && (
              <div style={{ fontSize: 11.5, color: red, marginBottom: 8 }}>
                {!vehicleComplete
                  ? "Fill in your vehicle's make, model, and plate."
                  : !allChecked
                  ? "Check all three boxes to continue."
                  : !signed
                  ? "Sign in the box above to continue."
                  : ""}
              </div>
            )}
            {submitError && (
              <div style={{ fontSize: 11.5, color: red, marginBottom: 8 }}>{submitError}</div>
            )}
            <PrimaryButton onClick={submit} disabled={!canSubmit}>
              {submitting ? "Saving..." : "Sign and authorize"}
            </PrimaryButton>
          </div>
        </Screen>
      )}

      {screen === "active" && (
        <Screen>
          <TopBar label="Trip in progress" />
          <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
            <div
              style={{
                background: surface,
                border: `1px solid ${green}55`,
                borderRadius: 14,
                padding: 16,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: green }} />
              <div style={{ fontSize: 13 }}>
                Authorization signed
                {signedAt ? ` at ${signedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
                {tripId ? ` · trip ${tripId.slice(0, 8)}` : ""}
              </div>
            </div>

            <div style={{ marginTop: 20, fontFamily: serif, fontSize: 20 }}>
              Jordan is driving your {vehicle.make || "car"} home.
            </div>
            <div style={{ marginTop: 6, color: textMuted, fontSize: 13 }}>
              You'll ride along. ETA 38 minutes.
            </div>

            <div style={{ flex: 1 }} />
            <GhostButton onClick={() => setScreen("complete")}>
              End trip (demo)
            </GhostButton>
          </div>
        </Screen>
      )}

      {screen === "complete" && (
        <Screen>
          <TopBar label="Trip complete" />
          <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <div style={{ fontFamily: serif, fontSize: 24 }}>You're home.</div>
            <p style={{ color: textMuted, fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>
              Your car's back in the driveway. Authorization for Jordan T. has closed automatically.
            </p>
            <div style={{ width: "100%", marginTop: 24 }}>
              <PrimaryButton onClick={() => setScreen("home")}>Done</PrimaryButton>
            </div>
          </div>
        </Screen>
      )}
    </div>
  );
}
