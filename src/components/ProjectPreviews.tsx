import type { ReactNode } from "react";
import type { ProjectRecord } from "../data/projects";

type Box = readonly [x: number, y: number, width: number, height: number];

interface LabTake {
  id: "a" | "b";
  key: string;
  duration: number;
  startup: number;
  active: number;
  recovery: number;
  hit: readonly [number, number];
  cancel: readonly [number, number];
  hitbox: { readonly x: number; readonly y: number; readonly w: number; readonly h: number };
  damage: number;
  pushback: number;
  hurtboxes: readonly Box[];
  keyTimes: string;
  pelvis: string | null;
  bones: Readonly<Record<string, string>>;
  still: Readonly<Record<string, number>>;
}

const LAB_TAKES: readonly LabTake[] = [
  {
    id: "a",
    key: "standing_light",
    duration: 18,
    startup: 4,
    active: 2,
    recovery: 12,
    hit: [4, 5],
    cancel: [5, 15],
    hitbox: { x: 26, y: 62, w: 44, h: 20 },
    damage: 30,
    pushback: 3,
    hurtboxes: [[-16, 0, 32, 44], [-18, 44, 36, 38], [-14, 82, 28, 22]],
    keyTimes: "0;0.167;0.222;0.278;0.556;0.94;1",
    pelvis: null,
    bones: {
      torso: "0;6;-9;-10;-4;-0.8;0",
      head: "0;2.25;3;2.81;1.88;0.38;0",
      arm_upper_r: "20;-20;-76;-78;-34;9.2;20",
      arm_lower_r: "46;70;4;0;40;44.8;46"
    },
    still: {}
  },
  {
    id: "b",
    key: "crouching_light",
    duration: 16,
    startup: 4,
    active: 3,
    recovery: 9,
    hit: [4, 6],
    cancel: [6, 13],
    hitbox: { x: 22, y: 12, w: 42, h: 18 },
    damage: 20,
    pushback: 2.2,
    hurtboxes: [[-18, 0, 36, 34], [-18, 34, 36, 22], [-14, 56, 28, 20]],
    keyTimes: "0;0.25;0.375;1",
    pelvis: "0 -32;0 -30;0 -30.33;0 -32",
    bones: {
      torso: "-12;-18;-19;-12",
      arm_upper_r: "34;-54;-58;34",
      arm_lower_r: "60;16;12;60"
    },
    still: { leg_upper_l: -62, leg_lower_l: 78, leg_upper_r: 54, leg_lower_r: -70 }
  }
];

const IDLE_TAKE: LabTake = {
  id: "a",
  key: "idle",
  duration: 1,
  startup: 0,
  active: 0,
  recovery: 1,
  hit: [0, 0],
  cancel: [0, 0],
  hitbox: { x: 0, y: 0, w: 0, h: 0 },
  damage: 0,
  pushback: 0,
  hurtboxes: [],
  keyTimes: "",
  pelvis: null,
  bones: {},
  still: {}
};

function LabBone({
  take,
  name,
  pivot,
  children
}: {
  take: LabTake;
  name: string;
  pivot: string;
  children: ReactNode;
}) {
  const values = take.bones[name];
  const still = take.still[name];
  const className = values ? `lab-bone lab-bone-${take.id}-${name}` : undefined;
  const transform = !values && still !== undefined ? `rotate(${still})` : undefined;

  return (
    <g transform={`translate(${pivot})`}>
      <g className={className} transform={transform}>{children}</g>
    </g>
  );
}

function LabFighter({ take }: { take: LabTake }) {
  const footL = (
    <LabBone take={take} name="foot_l" pivot="0 22">
      <rect x="-4" y="0" width="16" height="6" rx="2.5" fill="var(--far-dark)" />
    </LabBone>
  );
  const legLowerL = (
    <LabBone take={take} name="leg_lower_l" pivot="0 24">
      <rect x="-5" y="0" width="10" height="22" rx="4" fill="var(--far)" />
      {footL}
    </LabBone>
  );
  const legL = (
    <LabBone take={take} name="leg_upper_l" pivot="-1 0">
      <rect x="-5.5" y="0" width="11" height="24" rx="4.5" fill="var(--far)" />
      {legLowerL}
    </LabBone>
  );

  const footR = (
    <LabBone take={take} name="foot_r" pivot="0 22">
      <rect x="-4" y="0" width="16" height="6" rx="2.5" fill="var(--near-dark)" />
    </LabBone>
  );
  const legLowerR = (
    <LabBone take={take} name="leg_lower_r" pivot="0 24">
      <rect x="-5" y="0" width="10" height="22" rx="4" fill="var(--near)" />
      {footR}
    </LabBone>
  );
  const legR = (
    <LabBone take={take} name="leg_upper_r" pivot="1 0">
      <rect x="-5.5" y="0" width="11" height="24" rx="4.5" fill="var(--near)" />
      {legLowerR}
    </LabBone>
  );

  const handL = (
    <LabBone take={take} name="hand_l" pivot="0 14">
      <circle cx="0" cy="3" r="4.5" fill="var(--far-dark)" />
    </LabBone>
  );
  const armLowerL = (
    <LabBone take={take} name="arm_lower_l" pivot="0 16">
      <rect x="-3.5" y="0" width="7" height="14" rx="3" fill="var(--far)" />
      {handL}
    </LabBone>
  );
  const armL = (
    <LabBone take={take} name="arm_upper_l" pivot="-2 -26">
      <rect x="-4" y="0" width="8" height="16" rx="3.5" fill="var(--far)" />
      {armLowerL}
    </LabBone>
  );

  const handR = (
    <LabBone take={take} name="hand_r" pivot="0 14">
      <circle cx="0" cy="3" r="5" fill="var(--near-dark)" />
    </LabBone>
  );
  const armLowerR = (
    <LabBone take={take} name="arm_lower_r" pivot="0 16">
      <rect x="-3.5" y="0" width="7" height="14" rx="3" fill="var(--near)" />
      {handR}
    </LabBone>
  );
  const armR = (
    <LabBone take={take} name="arm_upper_r" pivot="2 -26">
      <rect x="-4" y="0" width="8" height="16" rx="3.5" fill="var(--near)" />
      {armLowerR}
    </LabBone>
  );

  const head = (
    <LabBone take={take} name="head" pivot="0 -30">
      <circle cx="1" cy="-11" r="11" fill="var(--body)" />
      <path d="M 8 -15 L 14 -12 L 8 -9 Z" fill="var(--accent)" />
    </LabBone>
  );
  const torso = (
    <LabBone take={take} name="torso" pivot="0 0">
      <rect x="-11" y="-30" width="22" height="30" rx="6" fill="var(--body)" />
      <rect x="-11" y="-18" width="22" height="3" fill="var(--accent)" opacity=".65" />
      {armL}
      {head}
      {armR}
    </LabBone>
  );

  const spine = (
    <>
      <rect x="-9" y="-6" width="18" height="12" rx="4" fill="var(--body)" />
      {legL}
      {torso}
      {legR}
    </>
  );

  if (!take.pelvis) return <g transform="translate(0 -46)">{spine}</g>;
  return <g className={`lab-pelvis lab-pelvis-${take.id}`}>{spine}</g>;
}

function LabBox({ box, className }: { box: Box; className: string }) {
  const [x, y, width, height] = box;
  return <rect className={className} x={x} y={-(y + height)} width={width} height={height} />;
}

function LabDummy({ take }: { take: LabTake }) {
  const contactY = -(take.hitbox.y + take.hitbox.h / 2);
  return (
    <>
      <g className={`lab-dummy lab-dummy-${take.id}`}>
        {([[ -16, 0, 32, 44 ], [ -18, 44, 36, 38 ], [ -14, 82, 28, 22 ]] as const).map((box, index) => (
          <LabBox key={index} box={box} className="lab-hurtbox" />
        ))}
        <g className={`lab-dummy-body lab-dummy-body-${take.id}`}>
          <g transform="scale(-1 1)">
            <g className="fighter-p2"><LabFighter take={IDLE_TAKE} /></g>
          </g>
        </g>
      </g>
      <g transform={`translate(47 ${contactY})`}>
        <g className={`lab-contact lab-contact-${take.id}`}>
          <circle className="lab-contact-ring" r="9" />
          <path className="lab-contact-rays" d="M-16 0H16M0-16V16M-12-12 12 12M12-12-12 12" />
        </g>
      </g>
    </>
  );
}

function LabTakeVisual({ take }: { take: LabTake }) {
  const hitbox: Box = [take.hitbox.x, take.hitbox.y, take.hitbox.w, take.hitbox.h];
  return (
    <g className={`lab-take lab-take-${take.id}`} transform="translate(-30 0)">
      {take.hurtboxes.map((box, index) => <LabBox key={index} box={box} className="lab-hurtbox" />)}
      <g className="fighter-p1"><LabFighter take={take} /></g>
      <g className={`lab-hit-window lab-hit-window-${take.id}`}><LabBox box={hitbox} className="lab-hitbox" /></g>
      <LabDummy take={take} />
    </g>
  );
}

function LabTimeline({ take }: { take: LabTake }) {
  const cells = Array.from({ length: take.duration }, (_, index) => {
    const phase = index < take.startup ? "startup" : index < take.startup + take.active ? "active" : "recovery";
    return {
      frame: String(index + 1).padStart(2, "0"),
      phase,
      phaseLabel: phase === "startup" ? "S" : phase === "active" ? "A" : "R",
      hit: index >= take.hit[0] && index <= take.hit[1],
      cancel: index >= take.cancel[0] && index <= take.cancel[1]
    };
  });

  const row = (label: string, body: ReactNode) => (
    <div className="lab-row"><strong>{label}</strong><div>{body}</div></div>
  );

  return (
    <div className={`lab-take lab-take-${take.id} lab-tl lab-tl-${take.duration}`}>
      <header>
        <div><p>Move timeline / event-derived</p><strong className="lab-move-name">{take.key}</strong></div>
        <dl>
          <div><dt>Startup</dt><dd>{take.startup}f</dd></div>
          <div><dt>Active</dt><dd>{take.active}f</dd></div>
          <div><dt>Recovery</dt><dd>{take.recovery}f</dd></div>
          <div><dt>Total</dt><dd>{take.duration}f</dd></div>
        </dl>
      </header>
      <div className="lab-rows">
        {row("Frame", cells.map((cell) => <span key={cell.frame} className="lab-cell lab-cell-number">{cell.frame}</span>))}
        {row("Phase", cells.map((cell) => <span key={cell.frame} className={`lab-cell lab-on lab-phase-${cell.phase}`}>{cell.phaseLabel}</span>))}
        {row("Hit", cells.map((cell) => <span key={cell.frame} className={`lab-cell${cell.hit ? " lab-cell-hit" : ""}`}>{cell.hit ? "H" : ""}</span>))}
        {row("Cancel", cells.map((cell) => <span key={cell.frame} className={`lab-cell${cell.cancel ? " lab-cell-cancel" : ""}`}>{cell.cancel ? "C" : ""}</span>))}
        <div className="lab-track"><i className="lab-playhead"></i></div>
      </div>
    </div>
  );
}

function frameRange([start, end]: readonly [number, number]): string {
  return start === end ? String(start + 1) : `${start + 1}–${end + 1}`;
}

function HexframeMoveData() {
  return (
    <div className="sr-only">
      <table id="hexframe-move-data">
        <caption>Hexframe move data represented by the animated timeline</caption>
        <thead>
          <tr>
            <th scope="col">Move</th><th scope="col">Startup frames</th><th scope="col">Active frames</th>
            <th scope="col">Recovery frames</th><th scope="col">Hit frames</th><th scope="col">Cancel frames</th>
            <th scope="col">Damage</th><th scope="col">Pushback</th>
          </tr>
        </thead>
        <tbody>
          {LAB_TAKES.map((take) => {
            const activeStart = take.startup + 1;
            const activeEnd = take.startup + take.active;
            const recoveryStart = activeEnd + 1;
            return (
              <tr key={take.id}>
                <th scope="row">{take.key}</th>
                <td>1–{take.startup}</td>
                <td>{activeStart}–{activeEnd}</td>
                <td>{recoveryStart}–{take.duration}</td>
                <td>{frameRange(take.hit)}</td>
                <td>{frameRange(take.cancel)}</td>
                <td>{take.damage}</td>
                <td>{take.pushback}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function SharkTankPreview() {
  return (
    <div className="project-visual tank-preview" role="img" aria-label="Shark Tank gameplay: rival sharks chase and eat food dots while the player's cyan shark chomp-dashes and fires a rocket across the live tank">
      <div className="tank-arena">
        <svg viewBox="0 0 800 470" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
          <defs>
            <pattern id="tankSea" width="48" height="48" patternUnits="userSpaceOnUse">
              <circle cx="7" cy="9" r="2.1" fill="#2f7a92" fillOpacity=".5" />
              <circle cx="31" cy="30" r="1.5" fill="#4b3f86" fillOpacity=".55" />
            </pattern>
            <symbol id="tankShark" viewBox="0 0 180 110">
              <path d="M35 55 4 26l8 30-8 29 31-25c12 26 67 35 112 4 12-8 20-8 29-9-9-2-17-4-29-12C102 13 47 27 35 55Z" fill="var(--body, #22e6ff)" stroke="#070b14" strokeWidth="5" strokeLinejoin="round" />
              <path d="M76 29 91 5l19 28M76 75 90 102l14-29" fill="var(--accent, #0891b2)" stroke="#070b14" strokeWidth="5" strokeLinejoin="round" />
              <path d="M41 48c24-15 62-22 106-5-43-8-79 1-105 19Z" fill="#fff" opacity=".18" />
              <circle cx="137" cy="40" r="13" fill="#fff" stroke="#070b14" strokeWidth="4" />
              <circle cx="142" cy="43" r="5" fill="#070b14" />
              <path d="M119 66q21 16 42-2-21 31-42 2Z" fill="#47142a" stroke="#070b14" strokeWidth="4" strokeLinejoin="round" />
              <path d="m126 69 5 10 6-8 6 8 5-11" fill="#fff" stroke="#070b14" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="158" cy="48" r="3" fill="#070b14" />
            </symbol>
            <symbol id="tankRocket" viewBox="0 0 72 34">
              <path d="M66 17 47 6H23L9 17l14 11h24Z" fill="#f3f1ff" stroke="#070b14" strokeWidth="3" strokeLinejoin="round" />
              <path d="M25 7 9 1l5 16L9 33l16-6" fill="#ff5a36" stroke="#070b14" strokeWidth="3" strokeLinejoin="round" />
              <circle cx="47" cy="17" r="6" fill="#22e6ff" stroke="#070b14" strokeWidth="3" />
            </symbol>
          </defs>
          <rect width="800" height="470" fill="#0b0a14" />
          <rect width="800" height="470" fill="url(#tankSea)" />
          <g stroke="#315468" strokeOpacity=".54" strokeWidth="1">
            <path d="M96 0v470M226 0v470M356 0v470M486 0v470M616 0v470" />
          </g>
          <g className="tank-food" aria-hidden="true">
            <circle cx="196" cy="196" r="3.4" fill="#ffd54a" opacity=".8" />
            <circle className="tank-food-eat tank-food-eat-a" cx="477" cy="176" r="4.2" fill="#ffd54a" />
            <circle className="tank-food-eat tank-food-eat-b" cx="297" cy="351" r="4.2" fill="#22e6ff" />
            <circle className="tank-food-eat tank-food-eat-c" cx="543" cy="376" r="5.2" fill="#ff8a1f" />
            <circle className="tank-food-eat tank-food-eat-you" cx="449" cy="241" r="4.6" fill="#ffd54a" />
            <circle cx="243" cy="286" r="3.4" fill="#22e6ff" opacity=".8" />
            <circle cx="404" cy="150" r="3.4" fill="#ffd54a" opacity=".8" />
            <circle cx="470" cy="268" r="5" fill="#ff8a1f" opacity=".98" />
            <circle cx="330" cy="404" r="3.4" fill="#ffd54a" opacity=".8" />
            <circle cx="150" cy="330" r="3.4" fill="#22e6ff" opacity=".8" />
            <circle cx="530" cy="196" r="3.4" fill="#ffd54a" opacity=".8" />
          </g>
          <g className="tank-fish tank-fish-a"><use href="#tankShark" x="380" y="150" width="78" height="48" className="skin-gold" /></g>
          <g className="tank-fish tank-fish-b"><use href="#tankShark" x="196" y="330" width="70" height="43" className="skin-violet" /></g>
          <g className="tank-fish tank-fish-c"><use href="#tankShark" x="424" y="356" width="64" height="39" className="skin-orange" /></g>
          <g className="tank-fish tank-fish-you">
            <g className="tank-dash-trail">
              <circle cx="280" cy="244" r="10" fill="#22e6ff" />
              <circle cx="258" cy="248" r="7" fill="#fff" />
              <circle cx="239" cy="241" r="5" fill="#22e6ff" />
              <circle cx="224" cy="246" r="3.5" fill="#fff" />
            </g>
            <use href="#tankShark" x="286" y="212" width="106" height="65" className="skin-cyan" />
          </g>
          <g className="tank-rocket-shot">
            <g className="tank-rocket-flame">
              <circle cx="-8" cy="17" r="7" fill="#ff5a36" />
              <circle cx="-20" cy="17" r="5" fill="#ffd54a" />
              <circle cx="-31" cy="17" r="3.5" fill="#ff5a36" />
            </g>
            <use href="#tankRocket" width="72" height="34" />
          </g>
          <g transform="translate(702 234)">
            <g className="tank-rocket-burst">
              <circle cx="-23" cy="-5" r="6" fill="#ff5a36" />
              <circle cx="-13" cy="-19" r="5" fill="#ffd54a" />
              <circle cx="4" cy="-24" r="4" fill="#fff" />
              <circle cx="19" cy="-14" r="6" fill="#ff8a1f" />
              <circle cx="25" cy="4" r="5" fill="#ffd54a" />
              <circle cx="12" cy="20" r="6" fill="#ff5a36" />
              <circle cx="-7" cy="24" r="4" fill="#fff" />
              <circle cx="-22" cy="14" r="5" fill="#ff8a1f" />
              <circle r="10" fill="#fff" />
            </g>
          </g>
        </svg>
      </div>
      <div className="tank-readout">
        <div className="tank-card"><span>Points</span><strong>2</strong></div>
        <div className="tank-card"><span>Rank</span><strong>16<small> / 24</small></strong></div>
        <div className="tank-card"><span>Size</span><strong>1.0<small>×</small></strong></div>
      </div>
      <div className="tank-board">
        <p className="tank-board-title">Top Sharks</p>
        <ol>
          <li><span>1</span><i className="dot-lime"></i><b>Wriggle</b><em>230</em></li>
          <li><span>2</span><i className="dot-violet"></i><b>Molar</b><em>197</em></li>
          <li><span>3</span><i className="dot-gold"></i><b>Chowder</b><em>177</em></li>
          <li><span>4</span><i className="dot-violet"></i><b>Fang</b><em>134</em></li>
          <li><span>5</span><i className="dot-cyan"></i><b>Barnacle</b><em>50</em></li>
        </ol>
      </div>
      <div className="tank-abilities">
        <span className="tank-ability tank-dash">
          <svg viewBox="0 0 32 24" aria-hidden="true"><path d="M2 6h13M1 12h11M4 18h11M17 2l13 10-13 10Z" /></svg>
          <b>Dash</b><small>Space</small>
        </span>
        <span className="tank-ability tank-rocket">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M19 4c4-2 7-2 9-2 0 2 0 5-2 9L15 22l-6-6L19 4Z" />
            <path d="m10 16-6 1-2 6 8-2M15 22l-1 8 6-2 1-6M9 23l-6 6" />
            <circle cx="22" cy="8" r="3" />
          </svg>
          <b>Rocket</b><small>Shift</small>
        </span>
      </div>
    </div>
  );
}

export function HexframePreview() {
  return (
    <div className="preview-with-data">
      <div className="project-visual lab-preview" role="img" aria-label="Hexframe training mode: two authored attacks deal 30 and 20 damage, produce impact sparks, reduce the dummy's health, and push the dummy backward in sync with the move timeline" aria-describedby="hexframe-move-data">
        <div className="lab-stage">
          <div className="lab-hud">
            <div className="lab-player">
              <span>You</span>
              <div className="lab-meters"><div className="lab-hp"><i className="lab-hp-p1"></i></div><div className="lab-sta"><i></i></div></div>
              <strong><b>1050</b><small>100 stamina</small></strong>
            </div>
            <div className="lab-player lab-player-right">
              <strong><b className="lab-health-readout"><i className="lab-health-number lab-health-1000">1000</i><i className="lab-health-number lab-health-970">970</i><i className="lab-health-number lab-health-950">950</i></b><small>100 stamina</small></strong>
              <div className="lab-meters"><div className="lab-hp"><i className="lab-hp-p2"></i></div><div className="lab-sta"><i></i></div></div>
              <span>Dummy</span>
            </div>
          </div>
          <svg viewBox="-150 -125 300 158" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
            <rect x="-400" y="-125" width="800" height="158" fill="#080a0f" />
            <rect x="-400" y="0" width="800" height="33" fill="#121219" />
            <line x1="0" y1="-125" x2="0" y2="33" stroke="#21262d" strokeWidth="1" strokeDasharray="4 8" />
            <line x1="-400" y1="0" x2="400" y2="0" stroke="#484f58" strokeWidth="2" />
            {LAB_TAKES.map((take) => <LabTakeVisual key={take.id} take={take} />)}
          </svg>
          <div className="lab-legend"><span className="lab-key lab-key-hurt">Hurtbox</span><span className="lab-key lab-key-hit">Hitbox</span></div>
          {LAB_TAKES.map((take) => (
            <div key={take.id} className={`lab-take lab-take-${take.id} lab-route`}>
              <span>Hit confirmed</span><strong>{take.key}</strong><em>{take.damage} damage · {take.pushback} pushback · {take.active} frames active</em>
            </div>
          ))}
        </div>
        {LAB_TAKES.map((take) => <LabTimeline key={take.id} take={take} />)}
      </div>
      <HexframeMoveData />
    </div>
  );
}

const YAR_SERIES = [
  { name: "Violet Orbit", units: 12, meta: "Comic · 0001 – 0012" },
  { name: "Nocturne City", units: 8, meta: "Comic · 0001 – 0008" },
  { name: "Iron Pilgrim", units: 16, meta: "Manga · 0001 – 0016" },
  { name: "The Amber Reach", units: 6, meta: "Comic · 0001 – 0006" },
  { name: "Below the Line", units: 10, meta: "Webtoon · 0001 – 0010" },
  { name: "Verdant Passage", units: 14, meta: "Manga · 0001 – 0014" }
] as const;

export function YarReaderPreview() {
  return (
    <div className="project-visual yar-preview" data-fixture="synthetic" aria-label="YarReader sample library with original fictional comics, manga and webtoons, a search field, filters, and per-series unit counts and chapter ranges">
      <div className="yar-head">
        <div className="yar-id"><strong>YarReader</strong><span>6 fictional series · 66 chapters · Original demo artwork</span></div>
        <div className="yar-search">Search series, title, year</div>
        <div className="yar-select">Alphabetical</div>
      </div>
      <div className="yar-filters">
        <span className="yar-label">Format</span>
        <span className="yar-pill yar-pill-on">All formats</span>
        <span className="yar-pill">Manga (RTL)</span>
        <span className="yar-pill">Comics (LTR)</span>
        <span className="yar-pill">Webtoons (Scroll)</span>
        <span className="yar-label yar-label-genre">Genre</span>
        <span className="yar-select yar-select-small">All genres</span>
      </div>
      <div className="yar-scope">
        <span className="yar-pill yar-pill-on">Series</span>
        <span className="yar-pill">Chapters</span>
        <em>6 sample series</em>
      </div>
      <div className="yar-grid">
        {YAR_SERIES.map((series, index) => (
          <article className="yar-card" key={series.name}>
            <div className={`yar-art yar-art-${index}`} role="img" aria-label={`Original fictional cover art for ${series.name}`}><i>{series.units}</i></div>
            <div className="yar-body"><span>{series.name}</span><strong>{series.units} units</strong><em>{series.meta}</em></div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ProjectPreview({ project }: { project: ProjectRecord }) {
  switch (project.slug) {
    case "sharktank":
      return <SharkTankPreview />;
    case "hexframe":
      return <HexframePreview />;
    case "yarreader":
      return <YarReaderPreview />;
  }
}
