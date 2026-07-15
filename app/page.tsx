"use client";

import {
  ArrowLeft, ArrowRight, Bell, BookOpen, CalendarDays, Camera, Check,
  ChevronRight, CircleUserRound, Compass, Gift, Heart, Home, Languages,
  KeyRound, LockKeyhole, LogIn, LogOut, Mail, Map, MapPin, Menu, NotebookPen,
  Palette, PenLine, Search, Share2, Sparkles, Stamp, UserPlus, Utensils,
  WalletCards, X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

type Tab = "home" | "map" | "record" | "book";
type Place = { id: number; name: string; area: string; tag: string; desc: string; x: number; y: number; image: string; credit: string; source: string };

const places: Place[] = [
  { id: 1, name: "흰여울문화마을", area: "영도", tag: "골목 산책", desc: "바다를 따라 이어지는 작은 골목과 푸른 풍경", x: 48, y: 73, image: "/huinnyeoul.jpg", credit: "Choi2451 · CC0", source: "https://commons.wikimedia.org/wiki/File:Huinnyeoul_culture_village,_Busan_on_October_25th,_2019.jpg" },
  { id: 2, name: "광안리 해변", area: "수영구", tag: "야경", desc: "광안대교가 가장 가까이 보이는 부산의 밤", x: 70, y: 41, image: "/gwangalli.jpg", credit: "Masterhatch · CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Gwangalli_Beach_and_Gwangan_Bridge_Busan.jpg" },
  { id: 3, name: "감천문화마을", area: "사하구", tag: "드로잉", desc: "겹겹이 쌓인 집과 색다른 골목의 리듬", x: 30, y: 47, image: "/gamcheon.jpg", credit: "Bernard Gagnon · CC0", source: "https://commons.wikimedia.org/wiki/File:Gamcheon_Culture_Village.jpg" },
  { id: 4, name: "해운대 해변", area: "해운대구", tag: "바다", desc: "넓은 수평선과 도시가 만나는 산책길", x: 82, y: 24, image: "/haeundae.jpg", credit: "螺钉 · CC BY-SA 3.0", source: "https://commons.wikimedia.org/wiki/File:Haeundae_Beach,_Busan,_S_Korea.jpg" },
];

const copy = {
  ko: { greeting: "좋은 오후예요, 여행자님", sub: "오늘은 부산의 어떤 장면을 담아볼까요?", mission: "오늘의 여행 미션", missionText: "파란 풍경 하나를 천천히 바라보고 기록해보세요.", rec: "오늘의 추천", nearby: "지금 가까운 로컬 스폿", map: "부산을 천천히 둘러보세요", record: "오늘의 장면을 남겨보세요", book: "나의 부산 여행책" },
  en: { greeting: "Good afternoon, traveler", sub: "Which scene of Busan will you keep today?", mission: "Today’s little mission", missionText: "Find one blue view, slow down, and capture how it feels.", rec: "Today’s picks", nearby: "Local spots near you", map: "Take your time around Busan", record: "Keep a scene from today", book: "My Busan travel book" },
};

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("home");
  const [lang, setLang] = useState<"ko" | "en">("ko");
  const [selected, setSelected] = useState<Place | null>(null);
  const [saved, setSaved] = useState(false);
  const [stampOpen, setStampOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [toast, setToast] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const t = copy[lang];

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2200); };
  const navigate = (next: Tab) => { setSelected(null); setTab(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openPlace = (place: Place) => setSelected(place);
  const startRecord = (place?: Place) => { if (place) setSelected(place); setTab("record"); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const upload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  const saveRecord = () => {
    setSaved(true); setStampOpen(true); setTab("book"); setSelected(null);
  };

  const title = useMemo(() => tab === "map" ? "지도" : tab === "record" ? "기록" : tab === "book" ? "여행책" : "LOCALOOM", [tab]);

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <div className="desktop-note"><span>LOCALOOM</span><p>부산의 장면을 모아<br/>한 권의 여행으로</p></div>
      <section className="phone">
        <header className="topbar">
          {tab !== "home" ? <button className="icon-btn" onClick={() => navigate("home")} aria-label="홈으로"><ArrowLeft size={20}/></button> : <button className="icon-btn" aria-label="알림" onClick={() => notify("새로운 알림이 없어요")}><Bell size={20}/><i/></button>}
          <strong className="wordmark">{title}</strong>
          <div className="header-actions">
            <button className="lang-btn" onClick={() => setLang(lang === "ko" ? "en" : "ko")} aria-label="언어 변경"><Languages size={17}/>{lang.toUpperCase()}</button>
            {tab === "home" && <button className="icon-btn" aria-label="메뉴" onClick={() => notify("설정은 곧 만나요")}><Menu size={21}/></button>}
          </div>
        </header>

        <div className="content">
          {tab === "home" && <HomeView t={t} loggedIn={loggedIn} onLogin={() => loggedIn ? (setLoggedIn(false), notify("로그아웃됐어요")) : setLoginOpen(true)} onPlace={openPlace} onTab={navigate} onMission={() => notify("미션을 여행책에 담았어요")}/>} 
          {tab === "map" && <MapView t={t} selected={selected} onSelect={setSelected} onRecord={startRecord}/>} 
          {tab === "record" && <RecordView t={t} selected={selected} image={image} note={note} setNote={setNote} onUpload={() => fileRef.current?.click()} onSave={saveRecord}/>} 
          {tab === "book" && <BookView t={t} saved={saved} image={image} note={note} onShare={() => notify("공유 링크를 준비했어요")} onTab={navigate}/>} 
        </div>

        <nav className="bottom-nav" aria-label="주요 메뉴">
          <NavButton active={tab === "home"} icon={<Home/>} label="홈" onClick={() => navigate("home")}/>
          <NavButton active={tab === "map"} icon={<MapPin/>} label="지도" onClick={() => navigate("map")}/>
          <button className={`record-fab ${tab === "record" ? "active" : ""}`} onClick={() => navigate("record")} aria-label="기록"><PenLine/><span>기록</span></button>
          <NavButton active={tab === "book"} icon={<BookOpen/>} label="여행책" onClick={() => navigate("book")}/>
        </nav>
      </section>

      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0])}/>
      {selected && tab !== "map" && tab !== "record" && <PlaceSheet place={selected} onClose={() => setSelected(null)} onRecord={() => startRecord(selected)}/>} 
      {stampOpen && <StampModal onClose={() => setStampOpen(false)}/>} 
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} onSuccess={() => { setLoggedIn(true); setLoginOpen(false); notify("관리자로 로그인됐어요"); }}/>} 
      {toast && <div className="toast"><Check size={16}/>{toast}</div>}
    </main>
  );
}

function HomeView({ t, loggedIn, onLogin, onPlace, onTab, onMission }: any) {
  return <div className="view home-view">
    <div className="hello"><div><p className="eyebrow">BUSAN · DAY 01</p><h1>{t.greeting}</h1><p>{t.sub}</p></div><div className="profile-actions"><div className={`avatar ${loggedIn ? "logged" : ""}`}><CircleUserRound/></div><button className="profile-login" onClick={onLogin}>{loggedIn ? <LogOut/> : <LogIn/>}{loggedIn ? "로그아웃" : "로그인"}</button></div></div>
    <button className="mission-card" onClick={onMission}>
      <div className="mission-icon"><Sparkles/></div><div><span>{t.mission}</span><h2>{t.missionText}</h2></div><ArrowRight className="mission-arrow"/>
      <div className="mission-progress"><i/><i/><i className="empty"/></div>
    </button>
    <section className="section"><div className="section-head"><div><span>01</span><h2>{t.rec}</h2></div><button onClick={() => onTab("map")}>모두 보기 <ArrowRight/></button></div>
      <div className="feature-card" onClick={() => onPlace(places[1])} role="button" tabIndex={0}>
        <div className="sea-art photo-scene" style={{backgroundImage:`linear-gradient(rgba(0,57,145,.2),rgba(0,57,145,.38)),url(${places[1].image})`}}><div className="moon"/><div className="bridge"><i/><i/><i/><i/><i/></div><div className="wave w1"/><div className="wave w2"/></div>
        <div className="feature-copy"><div><span>오늘, 빛이 머무는 곳</span><h3>광안리 해변</h3><p>해 질 무렵 바다의 온도를<br/>한 장면으로 기록해보세요.</p></div><button aria-label="장소 보기"><ArrowRight/></button></div>
      </div>
    </section>
    <section className="section"><div className="section-head"><div><span>02</span><h2>{t.nearby}</h2></div><button onClick={() => onTab("map")}>지도에서 보기 <Map/></button></div>
      <div className="place-list">{places.slice(0,3).map((p)=><button className="place-row" key={p.id} onClick={()=>onPlace(p)}><div className="place-photo" style={{backgroundImage:`linear-gradient(rgba(0,57,145,.2),rgba(0,57,145,.35)),url(${p.image})`}}/><div><span>{p.area} · {p.tag}</span><h3>{p.name}</h3><p>{p.desc}</p></div><ChevronRight/></button>)}</div>
    </section>
    <div className="photo-credits"><span>PHOTO CREDITS · WIKIMEDIA COMMONS</span>{places.map(p=><a key={p.id} href={p.source} target="_blank" rel="noreferrer">{p.name} — {p.credit}</a>)}</div>
  </div>;
}

function MapView({ t, selected, onSelect, onRecord }: any) {
  const [filter, setFilter] = useState("전체");
  return <div className="view map-view">
    <div className="map-intro"><p className="eyebrow">EXPLORE BUSAN</p><h1>{t.map}</h1></div>
    <div className="searchbox"><Search/><span>장소, 동네를 검색해보세요</span></div>
    <div className="chips">{["전체","바다","골목","드로잉"].map(v=><button key={v} className={filter===v?"active":""} onClick={()=>setFilter(v)}>{v}</button>)}</div>
    <div className="map-canvas">
      <div className="map-grid"/><div className="coast c1"/><div className="coast c2"/>
      <div className="river r1"/><div className="river r2"/>
      <span className="map-label busan">BUSAN</span><span className="map-label sea">SEA</span>
      <div className="stamp-count"><Stamp/> <strong>{selected ? "1" : "0"}/4</strong><span>방문 스탬프</span></div>
      {places.map((p)=><button key={p.id} style={{left:`${p.x}%`,top:`${p.y}%`}} className={`pin ${selected?.id===p.id?"active":""}`} onClick={()=>onSelect(p)} aria-label={p.name}><MapPin/><span>{p.name.replace("문화마을","")}</span></button>)}
      {selected && <div className="map-sheet"><button className="sheet-close" onClick={()=>onSelect(null)}><X/></button><div className="map-sheet-photo" style={{backgroundImage:`linear-gradient(rgba(0,57,145,.18),rgba(0,57,145,.38)),url(${selected.image})`}}/><div className="map-sheet-copy"><span>{selected.area} · {selected.tag}</span><h3>{selected.name}</h3><p>{selected.desc}</p><button className="primary small" onClick={()=>onRecord(selected)}>이 장소 기록하기 <PenLine/></button></div></div>}
    </div>
  </div>;
}

function RecordView({ t, selected, image, note, setNote, onUpload, onSave }: any) {
  const [color, setColor] = useState(2);
  return <div className="view record-view"><div className="record-title"><p className="eyebrow">TRAVEL NOTE · 01</p><h1>{t.record}</h1><p>완벽한 문장보다, 지금의 느낌에 가까운 기록이면 충분해요.</p></div>
    <button className={`upload-zone ${image?"has-image":""}`} onClick={onUpload} style={image?{backgroundImage:`linear-gradient(rgba(0,57,145,.06),rgba(0,57,145,.06)),url(${image})`}:{}}>{!image && <SceneArt kind="camera"/>}<div><Camera/><strong>{image?"사진을 바꿔볼까요?":"사진 또는 그림 추가"}</strong><span>{image?"눌러서 다시 선택하기":"오늘의 장면을 가장 먼저 담아주세요"}</span></div></button>
    <div className="form-card">
      <label><MapPin/><span><small>장소</small><input className="place-input" defaultValue={selected?.name || ""} placeholder="장소 이름을 입력해주세요" aria-label="장소 이름"/></span><PenLine className="field-edit-icon"/></label>
      <label><CalendarDays/><span><small>날짜</small><strong>2026. 07. 15</strong></span><ChevronRight/></label>
      <label><Utensils/><span><small>먹은 음식</small><input placeholder="기억하고 싶은 맛이 있나요?"/></span></label>
      <label><WalletCards/><span><small>가격</small><input placeholder="0" inputMode="numeric"/></span><em>원</em></label>
    </div>
    <div className="note-card"><div><Heart/><span><small>한 줄 감상</small><strong>이 장면을 어떻게 기억하고 싶나요?</strong></span></div><textarea value={note} onChange={e=>setNote(e.target.value)} maxLength={80} placeholder="바람이 불 때마다 바다가 더 가까워졌다."/><span className="counter">{note.length}/80</span></div>
    <div className="color-card"><div><Palette/><span><small>오늘의 색</small><strong>가장 닮은 파랑을 골라주세요</strong></span></div><div className="blue-swatches">{[.18,.32,.5,.7,.9].map((o,i)=><button key={o} onClick={()=>setColor(i)} className={color===i?"selected":""} style={{background:`rgba(0, 76, 181, ${o})`}} aria-label={`파랑 ${i+1}`}>{color===i&&<Check/>}</button>)}</div></div>
    <button className="primary save-btn" onClick={onSave}>기록 완료하기 <ArrowRight/></button>
  </div>;
}

function BookView({ t, saved, image, note, onShare, onTab }: any) {
  return <div className="view book-view"><div className="book-title"><p className="eyebrow">MY TRAVEL ARCHIVE</p><h1>{t.book}</h1><p>모은 장면들이 천천히 한 권의 여행이 됩니다.</p></div>
    <div className="book-cover"><div className="cover-top"><span>BUSAN · SUMMER 2026</span><span>01 / 04</span></div><div className="cover-visual" style={image?{backgroundImage:`linear-gradient(rgba(0,42,99,.28),rgba(0,42,99,.28)),url(${image})`}:{}}><div className="cover-sun"/><div className="cover-line l1"/><div className="cover-line l2"/><div className="cover-title"><small>A SLOW DAY IN</small><strong>BUSAN</strong><p>{note || "바람이 불 때마다 바다가 더 가까워졌다."}</p></div></div><div className="cover-foot"><span>LOCALOOM TRAVEL DIARY</span><button onClick={onShare}><Share2/> 공유</button></div></div>
    <div className="stamp-summary"><div><Stamp/><span><small>나의 여행 스탬프</small><strong>{saved?"1개의 장면을 모았어요":"첫 장면을 기다리고 있어요"}</strong></span></div><div className="stamp-dots">{[0,1,2,3].map(i=><i key={i} className={saved&&i===0?"done":""}>{saved&&i===0?<Check/>:i+1}</i>)}</div></div>
    <div className="result-list"><button><div className="result-icon"><NotebookPen/></div><span><small>기록을 이어서 읽는</small><strong>여행 다이어리</strong><p>{saved?"1개의 기록이 차곡차곡 쌓였어요":"아직 저장된 기록이 없어요"}</p></span><ChevronRight/></button><button><div className="result-icon"><Palette/></div><span><small>오늘의 색으로 만드는</small><strong>디지털 엽서</strong><p>한 장으로 가볍게 공유해보세요</p></span><ChevronRight/></button></div>
    {!saved && <button className="primary empty-cta" onClick={()=>onTab("record")}>첫 기록 남기기 <PenLine/></button>}
  </div>;
}

function NavButton({ active, icon, label, onClick }: any) { return <button className={active?"active":""} onClick={onClick}>{icon}<span>{label}</span></button>; }
function SceneArt({ kind, compact = false }: { kind: "village" | "beach" | "alley" | "lighthouse" | "camera"; compact?: boolean }) {
  return <div className={`scene-art scene-${kind} ${compact ? "compact" : ""}`} aria-hidden="true">
    <i className="scene-sun"/><i className="scene-horizon"/>
    {kind === "village" && <><i className="house h1"/><i className="house h2"/><i className="house h3"/><i className="stair s1"/><i className="stair s2"/></>}
    {kind === "beach" && <><i className="bridge-line"/><i className="bridge-tower bt1"/><i className="bridge-tower bt2"/><i className="bridge-cable bc1"/><i className="bridge-cable bc2"/></>}
    {kind === "alley" && <><i className="alley-wall aw1"/><i className="alley-wall aw2"/><i className="alley-path"/><i className="window w-left"/><i className="window w-right"/></>}
    {kind === "lighthouse" && <><i className="light-beam"/><i className="light-top"/><i className="light-body"/><i className="light-base"/></>}
    {kind === "camera" && <><i className="camera-body"/><i className="camera-lens"/><i className="camera-top"/><i className="photo-wave pw1"/><i className="photo-wave pw2"/></>}
  </div>;
}
function PlaceSheet({ place, onClose, onRecord }: any) { return <div className="overlay" onClick={onClose}><div className="place-sheet" onClick={e=>e.stopPropagation()}><div className="drag"/><button className="sheet-close" onClick={onClose}><X/></button><div className="sheet-photo" style={{backgroundImage:`linear-gradient(rgba(0,57,145,.12),rgba(0,57,145,.34)),url(${place.image})`}}><span>{place.area} · {place.tag}</span><div><h2>{place.name}</h2><p>{place.desc}</p></div></div><div className="sheet-facts"><span><Compass/><small>추천 시간</small><strong>해 질 무렵</strong></span><span><Camera/><small>기록 포인트</small><strong>바다와 골목</strong></span></div><button className="primary" onClick={onRecord}>이 장소 기록하기 <PenLine/></button></div></div>; }
function StampModal({ onClose }: any) { return <div className="overlay stamp-overlay"><div className="stamp-modal"><button className="sheet-close" onClick={onClose}><X/></button><div className="stamp-burst"><div className="stamp-mark"><Stamp/><span>BUSAN</span></div></div><span className="eyebrow">STAMP COLLECTED</span><h2>첫 번째 장면을<br/>여행책에 담았어요!</h2><p>기록이 저장되고 장소 스탬프가 발급됐어요.</p><button className="primary" onClick={onClose}>여행책 둘러보기 <BookOpen/></button></div></div>; }
function LoginModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      if (!res.ok) { setError("아이디 또는 비밀번호를 다시 확인해주세요."); return; }
      onSuccess();
    } catch { setError("로그인 중 문제가 발생했어요. 다시 시도해주세요."); }
    finally { setLoading(false); }
  };
  return <div className="login-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <form className="login-panel" onSubmit={submit}>
      <button type="button" className="sheet-close" onClick={onClose} aria-label="로그인 닫기"><X/></button>
      <div className="login-mark"><LockKeyhole/></div><p className="eyebrow">WELCOME TO LOCALOOM</p><h2>여행을 이어서<br/>기록해볼까요?</h2><p className="login-desc">나만의 부산 여행책을 안전하게 보관해요.</p>
      <label className="login-field"><span>아이디</span><div><Mail/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="이메일을 입력해주세요" autoComplete="username" required/></div></label>
      <label className="login-field"><span>비밀번호</span><div><KeyRound/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="비밀번호를 입력해주세요" autoComplete="current-password" required/></div></label>
      {error && <p className="login-error">{error}</p>}
      <button className="primary login-submit" type="submit" disabled={loading}>{loading ? "확인하고 있어요…" : "로그인"}<LogIn/></button>
      <div className="login-links"><button type="button" onClick={()=>setError("회원가입 기능은 준비 중이에요.")}><UserPlus/>회원가입</button><i/><button type="button" onClick={()=>setError("비밀번호 찾기 기능은 준비 중이에요.")}><KeyRound/>비밀번호 찾기</button></div>
    </form>
  </div>;
}
