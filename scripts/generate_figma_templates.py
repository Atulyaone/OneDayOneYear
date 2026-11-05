import os
import base64
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(BASE_DIR, "figma-design-templates")
COMPONENTS_DIR = os.path.join(OUTPUT_DIR, "components")
PUBLIC_DIR = os.path.join(BASE_DIR, "public", "figma-design-templates")
PUBLIC_COMPONENTS_DIR = os.path.join(PUBLIC_DIR, "components")

for d in [OUTPUT_DIR, COMPONENTS_DIR, PUBLIC_DIR, PUBLIC_COMPONENTS_DIR]:
    os.makedirs(d, exist_ok=True)

def get_base64_data_uri(image_path, fmt="png"):
    if os.path.exists(image_path):
        with open(image_path, "rb") as f:
            b64 = base64.b64encode(f.read()).decode("utf-8")
        return f"data:image/{fmt};base64,{b64}"
    return ""

user_media_1 = r"C:/Users/Shreya Shree Patra/.gemini/antigravity/brain/7b819ae8-6f0c-4aaa-a892-89bd4e229989/.user_uploaded/media_1793861726848_d087afd8.jpg"
archivist_uri = ""
if os.path.exists(user_media_1):
    im1 = Image.open(user_media_1)
    w, h = im1.size
    crop_archivist = im1.crop((int(w * 0.47), int(h * 0.172), int(w * 0.98), int(h * 0.322)))
    crop_path = os.path.join(OUTPUT_DIR, "_archivist_crop.jpg")
    crop_archivist.save(crop_path, format="JPEG", quality=90)
    archivist_uri = get_base64_data_uri(crop_path, fmt="jpeg")

user_media_4 = r"C:/Users/Shreya Shree Patra/.gemini/antigravity/brain/7b819ae8-6f0c-4aaa-a892-89bd4e229989/.user_uploaded/media_1793861864161_b36ea2bb.jpg"
mission_control_uri = ""
if os.path.exists(user_media_4):
    im4 = Image.open(user_media_4)
    w, h = im4.size
    crop_mc = im4.crop((int(w * 0.04), int(h * 0.518), int(w * 0.60), int(h * 0.655)))
    mc_path = os.path.join(OUTPUT_DIR, "_mc_crop.jpg")
    crop_mc.save(mc_path, format="JPEG", quality=90)
    mission_control_uri = get_base64_data_uri(mc_path, fmt="jpeg")

hero_png_path = os.path.join(BASE_DIR, "src", "assets", "hero.png")
newspaper_uri = get_base64_data_uri(hero_png_path, fmt="png")

# Template 1 generator
def generate_t1():
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1440 2950" width="1440" height="2950">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&amp;family=Playfair+Display:ital,wght@0,400;0,700;1,400&amp;family=IBM+Plex+Mono:wght@400;500;600&amp;family=Inter:wght@400;500;600;700&amp;display=swap');
      .serif-display {{ font-family: 'Cinzel', 'Playfair Display', Georgia, serif; }}
      .serif-body {{ font-family: 'Playfair Display', Georgia, serif; }}
      .mono {{ font-family: 'IBM Plex Mono', 'Courier New', monospace; }}
      .sans {{ font-family: 'Inter', -apple-system, sans-serif; }}
    </style>
    <pattern id="paperTexture" width="100" height="100" patternUnits="userSpaceOnUse">
      <rect width="100" height="100" fill="#E8DEC9" />
      <circle cx="25" cy="25" r="1" fill="#DCCFB6" opacity="0.4" />
      <circle cx="75" cy="65" r="1.5" fill="#D5C5A8" opacity="0.3" />
      <circle cx="50" cy="85" r="0.8" fill="#E0D3BC" opacity="0.5" />
    </pattern>
    <filter id="inkBleed" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.8" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect id="Canvas_Background" width="1440" height="2950" fill="url(#paperTexture)" />
  <rect x="24" y="24" width="1392" height="2902" fill="none" stroke="#2B2620" stroke-width="2" />
  <rect x="28" y="28" width="1384" height="2894" fill="none" stroke="#2B2620" stroke-width="0.8" />

  <!-- Top Utilities Header -->
  <g id="Top_Header">
    <text x="50" y="60" class="mono" font-size="12" font-weight="600" fill="#2B2620" letter-spacing="1.5">OD / OHM • PUBLIC ARCHIVES, VOL. I</text>
    <text x="1000" y="60" class="sans" font-size="12" font-weight="600" fill="#2B2620" letter-spacing="2">
      <tspan dx="0">CALENDAR</tspan>
      <tspan dx="35">SEARCH</tspan>
      <tspan dx="35">ABOUT</tspan>
      <tspan dx="35">SIGN IN</tspan>
    </text>
    <line x1="50" y1="75" x2="1390" y2="75" stroke="#2B2620" stroke-width="1.2" />
  </g>

  <!-- Masthead Section -->
  <g id="Masthead">
    <text x="720" y="150" text-anchor="middle" class="serif-display" font-size="74" font-weight="900" fill="#1C1814" letter-spacing="8">SPECIAL REPORT / VOL. I</text>
    <line x1="50" y1="180" x2="1390" y2="180" stroke="#1C1814" stroke-width="4" />
    <line x1="50" y1="186" x2="1390" y2="186" stroke="#1C1814" stroke-width="1.2" />
  </g>

  <!-- Cartographic Top Panels -->
  <g id="Section_Cartography" transform="translate(50, 210)">
    <!-- Map 1 (Left): Hybrid Maps & Layouts -->
    <g id="Panel_Cartography_Left">
      <rect x="0" y="0" width="650" height="340" fill="#DFD2BD" stroke="#2B2620" stroke-width="1.5" />
      <rect x="4" y="4" width="642" height="332" fill="none" stroke="#2B2620" stroke-width="0.7" />
      
      <!-- Vector Map Drawing of North America Grid -->
      <g id="Vector_Map_US" opacity="0.85">
        <!-- Latitude / Longitude Grid -->
        <line x1="20" y1="60" x2="630" y2="60" stroke="#9A8C74" stroke-width="0.8" stroke-dasharray="4 4" />
        <line x1="20" y1="120" x2="630" y2="120" stroke="#9A8C74" stroke-width="0.8" stroke-dasharray="4 4" />
        <line x1="20" y1="180" x2="630" y2="180" stroke="#9A8C74" stroke-width="0.8" stroke-dasharray="4 4" />
        <line x1="20" y1="240" x2="630" y2="240" stroke="#9A8C74" stroke-width="0.8" stroke-dasharray="4 4" />

        <line x1="120" y1="20" x2="120" y2="280" stroke="#9A8C74" stroke-width="0.8" stroke-dasharray="4 4" />
        <line x1="240" y1="20" x2="240" y2="280" stroke="#9A8C74" stroke-width="0.8" stroke-dasharray="4 4" />
        <line x1="360" y1="20" x2="360" y2="280" stroke="#9A8C74" stroke-width="0.8" stroke-dasharray="4 4" />
        <line x1="480" y1="20" x2="480" y2="280" stroke="#9A8C74" stroke-width="0.8" stroke-dasharray="4 4" />

        <!-- US Boundary Paths -->
        <path d="M 60 70 L 140 68 L 220 72 L 310 70 L 380 65 L 430 80 L 460 72 L 530 85 L 560 120 L 580 150 L 560 180 L 530 200 L 490 230 L 450 250 L 400 240 L 350 260 L 290 240 L 220 220 L 160 215 L 110 200 L 70 170 L 60 110 Z" fill="none" stroke="#2B2620" stroke-width="1.8" />
        <!-- State lines -->
        <path d="M 140 68 L 145 130 L 210 135 M 220 72 L 225 150 M 310 70 L 315 160 L 400 160 M 380 65 L 385 130 M 145 130 L 70 140 M 160 215 L 210 135 L 290 140 L 290 240 M 350 160 L 350 260 M 430 80 L 440 180 L 530 180" fill="none" stroke="#5A4E3C" stroke-width="0.9" />
        
        <!-- Target Marker / Coordinates Reticle -->
        <circle cx="265" cy="145" r="14" fill="none" stroke="#8A2B18" stroke-width="2" />
        <circle cx="265" cy="145" r="6" fill="#8A2B18" />
        <line x1="240" y1="145" x2="290" y2="145" stroke="#8A2B18" stroke-width="1.5" />
        <line x1="265" y1="120" x2="265" y2="170" stroke="#8A2B18" stroke-width="1.5" />
        <rect x="290" y="132" width="110" height="24" fill="#E8DEC9" stroke="#8A2B18" stroke-width="1" />
        <text x="295" y="148" class="mono" font-size="10" font-weight="600" fill="#8A2B18">SITE 04 • 38°N 77°W</text>
      </g>

      <rect x="0" y="295" width="650" height="45" fill="#2B2620" />
      <text x="325" y="324" text-anchor="middle" class="sans" font-size="12" font-weight="700" fill="#E8DEC9" letter-spacing="2">HYBRID MAPS &amp; CARTOGRAPHIC LAYOUTS</text>
    </g>

    <!-- Map 2 (Right): Original Documents & Correspondence -->
    <g id="Panel_Cartography_Right" transform="translate(690, 0)">
      <rect x="0" y="0" width="650" height="340" fill="#DFD2BD" stroke="#2B2620" stroke-width="1.5" />
      <rect x="4" y="4" width="642" height="332" fill="none" stroke="#2B2620" stroke-width="0.7" />

      <!-- Vector Urban Road/Transit Grid -->
      <g id="Vector_Urban_Grid" opacity="0.85">
        <path d="M 40 40 Q 180 140 320 120 T 600 240" fill="none" stroke="#2B2620" stroke-width="3" />
        <path d="M 80 260 Q 240 200 360 80 T 580 40" fill="none" stroke="#2B2620" stroke-width="2.5" />
        <path d="M 20 180 L 620 150" fill="none" stroke="#5A4E3C" stroke-width="2" />
        <path d="M 180 30 L 180 280" fill="none" stroke="#5A4E3C" stroke-width="1.5" />
        <path d="M 460 30 L 460 280" fill="none" stroke="#5A4E3C" stroke-width="1.5" />
        <path d="M 320 20 L 320 290" fill="none" stroke="#8A2B18" stroke-width="1.8" stroke-dasharray="6 3" />

        <!-- Radial highway bypasses -->
        <circle cx="320" cy="140" r="80" fill="none" stroke="#2B2620" stroke-width="1.2" />
        <circle cx="320" cy="140" r="140" fill="none" stroke="#5A4E3C" stroke-width="0.9" stroke-dasharray="5 5" />

        <!-- Building Block Matrix -->
        <rect x="90" y="80" width="30" height="20" fill="#9A8C74" opacity="0.5" />
        <rect x="130" y="75" width="25" height="30" fill="#9A8C74" opacity="0.5" />
        <rect x="220" y="90" width="40" height="25" fill="#9A8C74" opacity="0.6" />
        <rect x="380" y="160" width="50" height="30" fill="#9A8C74" opacity="0.6" />
        <rect x="440" y="170" width="35" height="25" fill="#9A8C74" opacity="0.5" />
        <rect x="500" y="120" width="45" height="35" fill="#9A8C74" opacity="0.6" />
      </g>

      <rect x="0" y="295" width="650" height="45" fill="#2B2620" />
      <text x="325" y="324" text-anchor="middle" class="sans" font-size="12" font-weight="700" fill="#E8DEC9" letter-spacing="2">ORIGINAL DOCUMENTS &amp; CORRESPONDENCE</text>
    </g>
  </g>

  <!-- Middle Upper Section: Archivist Text & Historical Photo -->
  <g id="Section_Archivist_Lead" transform="translate(50, 590)">
    <!-- Left Column: Editorial Columns -->
    <g id="Archivist_Columns_Left">
      <text x="0" y="30" class="sans" font-size="16" font-weight="800" fill="#1C1814" letter-spacing="1.5">THE APPOINTMENT OF THE FIRST ARCHIVIST</text>
      <line x1="0" y1="42" x2="650" y2="42" stroke="#1C1814" stroke-width="1" />

      <!-- Sub-column 1 -->
      <g transform="translate(0, 60)">
        <text class="serif-body" font-size="13" fill="#2B2620" line-height="1.5">
          <tspan x="0" y="0">Gome isno arcene lypeestiern-assients</tspan>
          <tspan x="0" y="20">baccraats reallidts to camplet to this</tspan>
          <tspan x="0" y="40">uncasse sarmasu and thereisene in tlar</tspan>
          <tspan x="0" y="60">corssanare of aonmeskin modovon</tspan>
          <tspan x="0" y="80">mosaedrco chwers or medoss thereselve</tspan>
          <tspan x="0" y="100">of mustext hantevement of its liro-garent</tspan>
          <tspan x="0" y="120">line tezons. Asmr narlced and dereosecases</tspan>
          <tspan x="0" y="140">dauderated crecate elraas arom motiers</tspan>
          <tspan x="0" y="160">disants to conereot the mansot teems</tspan>
          <tspan x="0" y="180">and lasons diss uroration tarnu ecocours</tspan>
          <tspan x="0" y="200">matisement and and coaling ones its</tspan>
          <tspan x="0" y="220">vusions and archival directives.</tspan>
        </text>
      </g>

      <!-- Vertical divider rule -->
      <line x1="320" y1="60" x2="320" y2="300" stroke="#9A8C74" stroke-width="0.8" />

      <!-- Sub-column 2 -->
      <g transform="translate(340, 60)">
        <text class="serif-body" font-size="13" fill="#2B2620" line-height="1.5">
          <tspan x="0" y="0">bending some ontanta oe chites cumiount</tspan>
          <tspan x="0" y="20">some users dantranner shafe glatteranear,</tspan>
          <tspan x="0" y="40">filtax have lac-consaliterative commant</tspan>
          <tspan x="0" y="60">and enrannos whale in the round disrates</tspan>
          <tspan x="0" y="80">antieronsis ceredesslent all dirst stanoss</tspan>
          <tspan x="0" y="100">of the determmants and converence was</tspan>
          <tspan x="0" y="120">lorauld to sacs herrilae satisfafeed to</tspan>
          <tspan x="0" y="140">creese modimate or matter lororats.</tspan>
          <tspan x="0" y="160">Preservation of records from the earliest</tspan>
          <tspan x="0" y="180">transmission logs remains sovereign to</tspan>
          <tspan x="0" y="200">the public mission across centuries.</tspan>
        </text>
        <rect x="0" y="235" width="130" height="26" fill="#2B2620" />
        <text x="65" y="252" text-anchor="middle" class="mono" font-size="11" font-weight="600" fill="#E8DEC9">EHLTES-INDEX</text>
      </g>
    </g>

    <!-- Right Column: Vintage Photograph Frame -->
    <g id="Archivist_Photo_Right" transform="translate(690, 0)">
      <rect x="0" y="0" width="650" height="320" fill="#1C1814" stroke="#2B2620" stroke-width="2" />
      {f'<image href="{archivist_uri}" x="6" y="6" width="638" height="308" preserveAspectRatio="xMidYMid slice" />' if archivist_uri else '''
      <rect x="6" y="6" width="638" height="308" fill="#3A3228" />
      <text x="325" y="160" text-anchor="middle" class="sans" font-size="16" fill="#C5B59C">[HISTORICAL ARCHIVE INSPECTION - 1969]</text>
      '''}
    </g>
  </g>

  <!-- Middle Lower Section: Detailed Article & Framed Selection Component -->
  <g id="Section_Appointment_Detail" transform="translate(50, 960)">
    <!-- Left Column: Article Story & Statistics Table -->
    <g id="Appointment_Detail_Left">
      <text x="0" y="45" class="serif-display" font-size="34" font-weight="900" fill="#1C1814" letter-spacing="2">THE APPOINTMENT OF</text>
      <text x="0" y="85" class="serif-display" font-size="34" font-weight="900" fill="#1C1814" letter-spacing="2">THE FIRST ARCHIVIST</text>
      <text x="0" y="120" class="sans" font-size="12" font-weight="700" fill="#8A2B18" letter-spacing="2">29 JULY 1969 / EXPLORING / FRSG</text>
      <line x1="0" y1="135" x2="650" y2="135" stroke="#1C1814" stroke-width="1.5" />

      <text class="serif-body" font-size="14" fill="#2B2620">
        <tspan x="0" y="165">The Appointment of the First Archivist, secreos and detronsom caber</tspan>
        <tspan x="0" y="190">cremaats alse Dise Inerete the vacoca issate of Mitaxes Nlassee II to</tspan>
        <tspan x="0" y="215">excert msitive than sext hess iffised in the measor's pronty have and</tspan>
        <tspan x="0" y="240">inventdenth merst affirations. Shendocdues and in main endainee</tspan>
        <tspan x="0" y="265">nid identity halley güsss omordaration ennnuel R&amp;W and sentiend retail</tspan>
        <tspan x="0" y="290">accessants accesssus carrious caradatims aroo prosono.</tspan>
      </text>

      <!-- Statistical Record Table -->
      <g id="Record_Stats_Table" transform="translate(0, 320)">
        <rect x="0" y="0" width="650" height="380" fill="#DFD2BD" stroke="#2B2620" stroke-width="1" />
        <line x1="0" y1="30" x2="650" y2="30" stroke="#2B2620" stroke-width="1" />
        <line x1="325" y1="0" x2="325" y2="380" stroke="#2B2620" stroke-width="1" />
        <text x="15" y="22" class="mono" font-size="12" font-weight="700" fill="#1C1814">METRIC PARAMETER</text>
        <text x="340" y="22" class="mono" font-size="12" font-weight="700" fill="#1C1814">FIELD VALUE / STATUS</text>

        <!-- Rows -->
        <g class="mono" font-size="11" fill="#2B2620">
          <text x="15" y="55">Date: 266</text><text x="340" y="55">Forest cenner: 116</text>
          <text x="15" y="80">Bate concons: 116</text><text x="340" y="80">Fineast 1965 on 7998s: 60</text>
          <text x="15" y="105">Reseosam hacher: 375</text><text x="340" y="105">Meats of ceat: 63M</text>
          <text x="15" y="130">Financt: 60</text><text x="340" y="130">Nerass incogne: 9</text>
          <text x="15" y="155">Roseider: 153</text><text x="340" y="155">Inatimal Dowers: 0</text>
          <text x="15" y="180">Resensert Resight: 135</text><text x="340" y="180">Lowane stats: 46</text>
          <text x="15" y="205">Focus esums: 46</text><text x="340" y="205">Acreasary, alce biets: 9</text>
          <text x="15" y="230">Business volume: 9</text><text x="340" y="230">Ammanawario: 1</text>
          <text x="15" y="255">Business Danet/Doras: 1</text><text x="340" y="255">becoming stroat donts: 16</text>
          <text x="15" y="280">Disparsive: 16</text><text x="340" y="280">estic precon acrot: 26</text>
          <text x="15" y="305">Demior: 26</text><text x="340" y="305">Shpata on dies: 60</text>
          <text x="15" y="330">Primary Band: S-BAND</text><text x="340" y="330">Frequency: 2287.5 MHz</text>
          <text x="15" y="355">Telemetry Status: SECURED</text><text x="340" y="355">Operational Flag: NOMINAL</text>
        </g>
      </g>
    </g>

    <!-- Right Column: Figma Highlight Frame (Blue selection box #18A0FB) -->
    <g id="Component_Figma_Selection" transform="translate(685, 0)">
      <!-- Figma Blue Component Selection Border -->
      <rect x="-6" y="-6" width="662" height="716" fill="none" stroke="#18A0FB" stroke-width="3" />
      <rect x="-10" y="-10" width="8" height="8" fill="#FFFFFF" stroke="#18A0FB" stroke-width="2" />
      <rect x="652" y="-10" width="8" height="8" fill="#FFFFFF" stroke="#18A0FB" stroke-width="2" />
      <rect x="-10" y="706" width="8" height="8" fill="#FFFFFF" stroke="#18A0FB" stroke-width="2" />
      <rect x="652" y="706" width="8" height="8" fill="#FFFFFF" stroke="#18A0FB" stroke-width="2" />

      <!-- Inner Content Box -->
      <rect x="0" y="0" width="650" height="704" fill="#E8DEC9" />

      <!-- Editorial Paragraph -->
      <g transform="translate(15, 25)">
        <text class="serif-body" font-size="13.5" fill="#1C1814" line-height="1.45">
          <tspan x="0" y="0">The first manetaa ham do first stated on aftes as reudoand</tspan>
          <tspan x="0" y="20">accoants with musmreen linsarn aasclerrattenze deement on</tspan>
          <tspan x="0" y="40">the eradarst ler te cause lei sest grone and fee that these haven</tspan>
          <tspan x="0" y="60">masue like the potential have sew vesouses memeclon can</tspan>
          <tspan x="0" y="80">plave margt inass olarim nurrential overezare maz offers second</tspan>
          <tspan x="0" y="100">have monue bearing coverpnance, svalen war oferenc to the</tspan>
          <tspan x="0" y="120">mew dinxiemo coveesma monelineats volertinte the saznano</tspan>
          <tspan x="0" y="140">dune of morioragos sand of the waves uoisents uncmeer nod's</tspan>
          <tspan x="0" y="160">rogac acw the mearnxconus over inverstmenty aceonas esai cannd</tspan>
          <tspan x="0" y="180">caso be mamtanred appenent of first assist invergore.</tspan>
        </text>

        <!-- Two Column Table: DATE TIME / TARABLES -->
        <g transform="translate(0, 220)">
          <line x1="0" y1="0" x2="620" y2="0" stroke="#1C1814" stroke-width="2" />
          <line x1="0" y1="28" x2="620" y2="28" stroke="#1C1814" stroke-width="1" />
          <text x="0" y="20" class="sans" font-size="12" font-weight="800" fill="#1C1814" letter-spacing="1.5">DATE TIME</text>
          <text x="320" y="20" class="sans" font-size="12" font-weight="800" fill="#1C1814" letter-spacing="1.5">TARABLES</text>

          <g class="mono" font-size="12" fill="#2B2620">
            <text x="0" y="50">Boajs: 8</text><text x="320" y="50">Coase usage: 14</text>
            <text x="0" y="74">Gestes: 6</text><text x="320" y="74">Corseries: 4</text>
            <text x="0" y="98">First time: 34</text><text x="320" y="98">Phote toxes: 2</text>
            <text x="0" y="122">Monel time: 20</text><text x="320" y="122">Deener viikorits: 20</text>
            <text x="0" y="146">Mernel vssits: 27</text><text x="320" y="146">Data dataganams: 25</text>
            <text x="0" y="170">Merset lastate: 3</text><text x="320" y="170">Strass Dawders: 15</text>
            <text x="0" y="194">Bapodistion date date: 24</text><text x="320" y="194">Septmance of seamnors: 7</text>
          </g>
          <line x1="0" y1="210" x2="620" y2="210" stroke="#1C1814" stroke-width="1.5" />
        </g>

        <!-- Subheading: EDITORIAL LECORD -->
        <g transform="translate(0, 465)">
          <text x="0" y="20" class="sans" font-size="13" font-weight="800" fill="#1C1814" letter-spacing="1.5">EDITORIAL LECORD</text>
          
          <!-- Bullets Left -->
          <g transform="translate(0, 40)" class="sans" font-size="12" fill="#2B2620" font-weight="500">
            <text x="0" y="0">• New Muension aignritants alhirants</text>
            <text x="0" y="24">• Abela leramien Semesion marted diass</text>
            <text x="0" y="48">• Pariskiack bestanced on staters</text>
            <text x="0" y="72">• Destiavared asrd ha shout Deock land</text>
            <text x="12" y="92">extenhed ltiss mns</text>
          </g>

          <!-- Right column note -->
          <g transform="translate(320, 30)">
            <text class="serif-body" font-size="11.5" fill="#3A3228">
              <tspan x="0" y="10">Aprfiil MTiler anf Technomote fise</tspan>
              <tspan x="0" y="26">ms portuloss diatin, knut Misske</tspan>
              <tspan x="0" y="42">Pryksmne mracerus heried corloherrante</tspan>
              <tspan x="0" y="58">desv a4 comuinal losernatteener or</tspan>
              <tspan x="0" y="74">rese-combirance neewis crarkatiomen</tspan>
              <tspan x="0" y="90">devsolated connerswraad deunts of</tspan>
              <tspan x="0" y="106">Geocoot, fnered modoeena nornoone</tspan>
              <tspan x="0" y="122">aixsanent, aomisciame poovide</tspan>
              <tspan x="0" y="138">cooreet stood mrvody.</tspan>
            </text>
          </g>
        </g>
      </g>
    </g>
  </g>

  <!-- Bottom Section: Three Boxed Dispatch Panels -->
  <g id="Section_Dispatch_Panels" transform="translate(50, 1720)">
    <line x1="0" y1="0" x2="1340" y2="0" stroke="#1C1814" stroke-width="3" />
    <line x1="0" y1="6" x2="1340" y2="6" stroke="#1C1814" stroke-width="1" />

    <!-- Panel 1 (Left): Technical Specifications -->
    <g id="Panel_Technical_Specs" transform="translate(0, 20)">
      <rect x="0" y="0" width="430" height="920" fill="#DFD2BD" stroke="#2B2620" stroke-width="1.5" />
      <rect x="0" y="0" width="430" height="40" fill="#2B2620" />
      <text x="15" y="26" class="sans" font-size="14" font-weight="800" fill="#E8DEC9" letter-spacing="1.5">TECHNICAL SPECIFICATIONS</text>

      <g transform="translate(20, 65)" class="mono" font-size="12" font-weight="600" fill="#1C1814">
        <text x="0" y="0">RECORD ID</text><text x="210" y="0">: REC-1969-0720-A1</text>
        <text x="0" y="28">VERIFICATION CODE</text><text x="210" y="28">: VOL. I-SEC. 04-0982</text>
        <text x="0" y="56">ARCHIVE STATUS</text><text x="210" y="56">: VERIFIED</text>
        <text x="0" y="84">SIGNAL BAND</text><text x="210" y="84">: S-BAND</text>
        <text x="0" y="112">FREQUENCY (CARRIER)</text><text x="210" y="112">: 2287.5 MHz</text>
        <text x="0" y="140">TELEMETRY LINK</text><text x="210" y="140">: SECURED</text>
        <text x="0" y="168">STATUS</text><text x="210" y="168">: NOMINAL</text>
      </g>

      <line x1="15" y1="260" x2="415" y2="260" stroke="#2B2620" stroke-width="1" />

      <!-- Vector Lunar Descent Trajectory Graphic -->
      <g id="Vector_Lunar_Trajectory" transform="translate(20, 290)">
        <text x="0" y="20" class="sans" font-size="11" font-weight="700" fill="#5A4E3C" letter-spacing="1">LUNAR DESCENT TRAJECTORY • PROFILE SEC 4</text>
        
        <!-- Descent Arc -->
        <path d="M 40 100 Q 180 120 280 260 T 340 420" fill="none" stroke="#1C1814" stroke-width="2.5" stroke-dasharray="6 3" />
        
        <!-- High orbit Lunar Module Icon -->
        <g transform="translate(30, 80) scale(0.9)">
          <rect x="0" y="0" width="30" height="24" fill="#1C1814" rx="3" />
          <polygon points="15,24 5,42 25,42" fill="none" stroke="#1C1814" stroke-width="2" />
          <line x1="-5" y1="42" x2="35" y2="42" stroke="#1C1814" stroke-width="2" />
          <circle cx="15" cy="12" r="4" fill="#E8DEC9" />
        </g>

        <!-- Landing touchdown Lunar Module Icon -->
        <g transform="translate(325, 380) scale(1.1)">
          <rect x="0" y="0" width="30" height="24" fill="#1C1814" rx="3" />
          <polygon points="15,24 5,42 25,42" fill="none" stroke="#1C1814" stroke-width="2" />
          <line x1="-10" y1="42" x2="40" y2="42" stroke="#1C1814" stroke-width="3" />
          <circle cx="15" cy="12" r="4" fill="#E8DEC9" />
        </g>

        <!-- Lunar Surface Craters -->
        <path d="M 0 520 Q 80 500 160 520 T 320 515 T 400 525" fill="none" stroke="#1C1814" stroke-width="3" />
        <ellipse cx="120" cy="515" rx="25" ry="6" fill="#C5B59C" stroke="#1C1814" stroke-width="1.2" />
        <ellipse cx="260" cy="518" rx="40" ry="8" fill="#C5B59C" stroke="#1C1814" stroke-width="1.2" />

        <rect x="0" y="550" width="50" height="24" fill="#1C1814" />
        <text x="25" y="566" text-anchor="middle" class="mono" font-size="11" font-weight="700" fill="#E8DEC9">B&amp;W</text>
      </g>
    </g>

    <!-- Panel 2 (Middle): The Landing Dispatch -->
    <g id="Panel_Landing_Dispatch" transform="translate(455, 20)">
      <rect x="0" y="0" width="430" height="920" fill="#E8DEC9" stroke="#2B2620" stroke-width="1.5" />
      <rect x="0" y="0" width="430" height="40" fill="#2B2620" />
      <text x="15" y="26" class="sans" font-size="14" font-weight="800" fill="#E8DEC9" letter-spacing="1.5">THE LANDING DISPATCH</text>

      <g transform="translate(20, 65)">
        <text class="serif-body" font-size="14" fill="#1C1814" line-height="1.55">
          <tspan x="0" y="0" font-weight="700">TRANQUILITY BASE, JULY 20, 1969 —</tspan>
          <tspan x="0" y="26">Contact was confirmed at 20:17:40</tspan>
          <tspan x="0" y="52">UTC. The lunar module "Eagle" touched</tspan>
          <tspan x="0" y="78">down in the Sea of Tranquility following</tspan>
          <tspan x="0" y="104">a descent over rugged terrain. Initial</tspan>
          <tspan x="0" y="130">checkouts confirmed life support and</tspan>
          <tspan x="0" y="156">electrical systems integrity.</tspan>
          
          <tspan x="0" y="210">All data packets from this period have</tspan>
          <tspan x="0" y="236">been cataloged under "VOL. I, SEC. 04"</tspan>
          <tspan x="0" y="262">and are preserved for public inspection.</tspan>
          <tspan x="0" y="288">Transmission logs indicate minimal signal</tspan>
          <tspan x="0" y="314">degradation during the primary egress</tspan>
          <tspan x="0" y="340">sequence.</tspan>
        </text>

        <!-- Framed Historic Quote Box -->
        <g transform="translate(0, 420)">
          <rect x="0" y="0" width="390" height="120" fill="#DFD2BD" stroke="#2B2620" stroke-width="2" />
          <rect x="4" y="4" width="382" height="112" fill="none" stroke="#2B2620" stroke-width="0.8" />
          <text class="serif-display" font-size="16" font-weight="700" fill="#1C1814">
            <tspan x="20" y="45">"Houston, Tranquility Base here.</tspan>
            <tspan x="20" y="75"> The Eagle has landed."</tspan>
          </text>
          <text x="20" y="102" class="sans" font-size="11" font-weight="600" fill="#8A2B18" letter-spacing="1">— APOLLO 11 TRANSMISSION LOG</text>
        </g>
      </g>
    </g>

    <!-- Panel 3 (Right): Cross-Referenced Index -->
    <g id="Panel_Cross_Index" transform="translate(910, 20)">
      <rect x="0" y="0" width="430" height="920" fill="#DFD2BD" stroke="#2B2620" stroke-width="1.5" />
      <rect x="0" y="0" width="430" height="40" fill="#2B2620" />
      <text x="15" y="26" class="sans" font-size="14" font-weight="800" fill="#E8DEC9" letter-spacing="1.5">CROSS-REFERENCED INDEX</text>

      <g transform="translate(20, 65)">
        <!-- Index Item 1: Vostok 1 -->
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="70" height="70" fill="#1C1814" />
          <circle cx="35" cy="35" r="22" fill="none" stroke="#E8DEC9" stroke-width="1.5" />
          <circle cx="35" cy="35" r="10" fill="#E8DEC9" />
          <rect x="4" y="4" width="28" height="14" fill="#2B2620" />
          <text x="18" y="14" text-anchor="middle" class="mono" font-size="8" fill="#E8DEC9">B&amp;W</text>

          <text x="85" y="20" class="mono" font-size="11" font-weight="700" fill="#8A2B18">12 APR 1961</text>
          <text x="85" y="40" class="sans" font-size="14" font-weight="800" fill="#1C1814">VOSTOK 1 ORBIT</text>
          <text x="85" y="60" class="serif-body" font-size="12" fill="#3A3228">Gagarin completes first human spaceflight.</text>
        </g>

        <line x1="0" y1="95" x2="390" y2="95" stroke="#9A8C74" stroke-width="0.8" />

        <!-- Index Item 2: Sputnik 1 -->
        <g transform="translate(0, 115)">
          <rect x="0" y="0" width="70" height="70" fill="#1C1814" />
          <circle cx="35" cy="35" r="14" fill="#E8DEC9" />
          <line x1="35" y1="35" x2="10" y2="10" stroke="#E8DEC9" stroke-width="1.5" />
          <line x1="35" y1="35" x2="60" y2="10" stroke="#E8DEC9" stroke-width="1.5" />
          <line x1="35" y1="35" x2="10" y2="60" stroke="#E8DEC9" stroke-width="1.5" />
          <rect x="4" y="4" width="28" height="14" fill="#2B2620" />
          <text x="18" y="14" text-anchor="middle" class="mono" font-size="8" fill="#E8DEC9">B&amp;W</text>

          <text x="85" y="20" class="mono" font-size="11" font-weight="700" fill="#8A2B18">04 OCT 1957</text>
          <text x="85" y="40" class="sans" font-size="14" font-weight="800" fill="#1C1814">SPUTNIK 1 TRANSMISSION</text>
          <text x="85" y="60" class="serif-body" font-size="12" fill="#3A3228">The first artificial Earth satellite launches.</text>
        </g>

        <line x1="0" y1="210" x2="390" y2="210" stroke="#2B2620" stroke-width="1.5" />

        <!-- Associated Moments -->
        <g transform="translate(0, 240)">
          <text x="0" y="0" class="sans" font-size="13" font-weight="800" fill="#1C1814" letter-spacing="1">ASSOCIATED INDEXED MOMENTS</text>
          <g transform="translate(0, 30)" class="mono" font-size="12" fill="#2B2620">
            <text x="0" y="0">• 16 JUL 1969: Saturn V Launch</text>
            <text x="16" y="20" fill="#5A4E3C">(REC-1969-0716)</text>
            
            <text x="0" y="55">• 24 JUL 1969: Splashdown</text>
            <text x="16" y="75" fill="#5A4E3C">(REC-1969-0724)</text>

            <text x="0" y="110">• 12 SEP 1962: "We Choose to go</text>
            <text x="16" y="130">to the Moon" Address</text>
          </g>
        </g>
      </g>
    </g>
  </g>

  <!-- Bottom Navigation Bar -->
  <g id="Bottom_Navigation" transform="translate(50, 2870)">
    <line x1="0" y1="0" x2="1340" y2="0" stroke="#1C1814" stroke-width="1.5" />
    <text x="15" y="40" class="mono" font-size="13" font-weight="700" fill="#1C1814">[ PREVIOUS DISPATCH ]</text>
    <text x="670" y="40" text-anchor="middle" class="mono" font-size="13" font-weight="700" fill="#1C1814">[ NEXT DISPATCH ]</text>
    <text x="1325" y="40" text-anchor="end" class="mono" font-size="13" font-weight="700" fill="#1C1814">[ BACK TO INDEX ]</text>
  </g>
</svg>'''
    return svg

print("Template 1 code compiled.")
# Template 2 generator: The Archive Opens
def generate_t2():
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1440 2850" width="1440" height="2850">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&amp;family=Playfair+Display:ital,wght@0,400;0,700;1,400&amp;family=IBM+Plex+Mono:wght@400;500;600&amp;family=Inter:wght@400;500;600;700&amp;family=Caveat:wght@600&amp;display=swap');
      .serif-display {{ font-family: 'Cinzel', 'Playfair Display', Georgia, serif; }}
      .serif-body {{ font-family: 'Playfair Display', Georgia, serif; }}
      .mono {{ font-family: 'IBM Plex Mono', 'Courier New', monospace; }}
      .sans {{ font-family: 'Inter', -apple-system, sans-serif; }}
      .handwritten {{ font-family: 'Caveat', 'Comic Sans MS', cursive; }}
    </style>
    <radialGradient id="stageGlow" cx="50%" cy="30%" r="55%" fx="50%" fy="25%">
      <stop offset="0%" stop-color="#2A2218" stop-opacity="0.9" />
      <stop offset="45%" stop-color="#14110E" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#080809" stop-opacity="1" />
    </radialGradient>
    <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EED7A1" />
      <stop offset="50%" stop-color="#D4B886" />
      <stop offset="100%" stop-color="#A7854F" />
    </linearGradient>
    <filter id="newspaperShadow" x="-20%" y="-20%" width="150%" height="150%">
      <feDropShadow dx="0" dy="25" stdDeviation="35" flood-color="#000000" flood-opacity="0.95" />
    </filter>
  </defs>

  <!-- Canvas Background -->
  <rect id="Canvas_Background" width="1440" height="2850" fill="#080809" />
  <rect width="1440" height="2850" fill="url(#stageGlow)" />

  <!-- Top Utilities Header -->
  <g id="Top_Header">
    <text x="60" y="65" class="mono" font-size="12" font-weight="600" fill="#8E8A82" letter-spacing="1.5">OD / OHM • PUBLIC RECORDS, VOL. 1</text>
    <text x="1100" y="65" class="sans" font-size="12" font-weight="600" fill="#8E8A82" letter-spacing="2">
      <tspan dx="0">CALENDAR</tspan>
      <tspan dx="35">SEARCH</tspan>
      <tspan dx="35">ABOUT</tspan>
    </text>
  </g>

  <!-- Center Hero Information Block -->
  <g id="Center_Hero" transform="translate(720, 150)">
    <!-- Cabinet Tag -->
    <rect x="-110" y="0" width="220" height="28" fill="#141210" stroke="#8A6E3D" stroke-width="1" rx="4" />
    <text x="0" y="18" text-anchor="middle" class="mono" font-size="10.5" font-weight="600" fill="#D4B886" letter-spacing="1.5">CABINET 01 / PUBLIC RECORDS</text>

    <!-- Kicker -->
    <text x="0" y="65" text-anchor="middle" class="sans" font-size="12" font-weight="700" fill="#C5A878" letter-spacing="4">ONE DAY / ONE HISTORICAL MOMENT</text>

    <!-- Grand Golden Headline -->
    <g class="serif-display" text-anchor="middle" font-size="78" font-weight="900" letter-spacing="6">
      <text x="0" y="150" fill="url(#goldText)">THE</text>
      <text x="0" y="235" fill="url(#goldText)">ARCHIVE</text>
      <text x="0" y="320" fill="url(#goldText)">OPENS</text>
    </g>

    <!-- Subtitle -->
    <text x="0" y="375" text-anchor="middle" class="serif-body" font-size="16" fill="#A8A096" letter-spacing="0.5">
      A date is more than a day. Enter a living index of the moments that changed what came after.
    </text>

    <!-- Action Buttons -->
    <g id="Hero_Actions" transform="translate(0, 420)">
      <!-- Primary Explore Button -->
      <g transform="translate(-190, 0)">
        <rect x="0" y="0" width="200" height="46" fill="#14110E" stroke="#C5A878" stroke-width="1.5" rx="2" />
        <text x="100" y="28" text-anchor="middle" class="sans" font-size="11.5" font-weight="700" fill="#EED7A1" letter-spacing="1.5">EXPLORE FEATURED EVENTS</text>
      </g>
      <!-- Secondary Browse Button -->
      <g transform="translate(30, 0)">
        <rect x="0" y="0" width="180" height="46" fill="transparent" stroke="#3D372E" stroke-width="1" rx="2" />
        <text x="90" y="28" text-anchor="middle" class="sans" font-size="11.5" font-weight="600" fill="#A89A84" letter-spacing="1.5">BROWSE DATE INDEX</text>
      </g>
    </g>
  </g>

  <!-- Centerpiece Vintage Newspaper Graphic -->
  <g id="Centerpiece_Newspaper" transform="translate(720, 850)">
    <!-- Underlying glow & shadow -->
    <ellipse cx="0" cy="180" rx="360" ry="120" fill="#000000" opacity="0.95" filter="url(#newspaperShadow)" />
    <ellipse cx="0" cy="120" rx="260" ry="80" fill="#2E2316" opacity="0.4" />

    {f'''<g transform="translate(-260, -80) scale(1.5)" filter="url(#newspaperShadow)">
      <image href="{newspaper_uri}" x="0" y="0" width="343" height="361" />
    </g>''' if newspaper_uri else '''
    <!-- Fallback Stylized Vector Folded Newspaper -->
    <g transform="translate(-250, -40)" filter="url(#newspaperShadow)">
      <polygon points="40,20 460,0 520,320 20,360" fill="#E8DEC9" stroke="#3A3225" stroke-width="2" />
      <polygon points="40,20 270,12 260,345 20,360" fill="#DFD2BC" stroke="#3A3225" stroke-width="1" />
      <line x1="270" y1="12" x2="260" y2="345" stroke="#2B2620" stroke-width="2" />
      <rect x="60" y="45" width="180" height="15" fill="#2B2620" />
      <rect x="60" y="70" width="85" height="60" fill="#5A4E3C" />
      <rect x="155" y="70" width="85" height="60" fill="#3A3228" />
    </g>
    '''}
  </g>

  <!-- User Hand-Drawn Annotation: "Scroll space" with Red Box & Arrow -->
  <g id="Annotation_Scroll_Space" transform="translate(140, 1380)">
    <!-- Hand-drawn style red bounding box -->
    <path d="M 10 15 
             Q 300 0 600 8 
             Q 900 16 1150 10 
             Q 1165 300 1155 680 
             Q 1148 1000 1150 1180 
             Q 850 1195 580 1185 
             Q 280 1178 15 1182 
             Q 2 800 8 400 
             Z" 
          fill="none" stroke="#E63946" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.9" />

    <!-- Handwritten "Scroll space" script text -->
    <text x="180" y="320" class="handwritten" font-size="110" font-weight="600" fill="#E63946" letter-spacing="3" transform="rotate(-3, 180, 320)">Scroll</text>
    <text x="320" y="580" class="handwritten" font-size="115" font-weight="600" fill="#E63946" letter-spacing="4" transform="rotate(-1, 320, 580)">space</text>

    <!-- Downward Hand-Drawn Curved Arrow -->
    <path d="M 1200 40 Q 1240 250 1230 500 Q 1220 750 1240 980" fill="none" stroke="#E63946" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 1205 920 L 1240 980 L 1265 930" fill="none" stroke="#E63946" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
  </g>

  <!-- Interactive Canvas Scrub Indicator -->
  <g id="Scrub_Stage_Telemetry" transform="translate(720, 2680)">
    <line x1="-300" y1="0" x2="300" y2="0" stroke="#2A241C" stroke-width="1.5" />
    <circle cx="0" cy="0" r="4" fill="#C5A878" />
    <rect x="-80" y="15" width="160" height="24" fill="#14110E" stroke="#3D372E" stroke-width="1" rx="2" />
    <text x="0" y="31" text-anchor="middle" class="mono" font-size="10.5" font-weight="600" fill="#A89A84">FRAME 001 OF 242</text>
  </g>

  <!-- Bottom Navigation Bar -->
  <g id="Bottom_Footer_Bar" transform="translate(60, 2790)">
    <line x1="0" y1="0" x2="1320" y2="0" stroke="#1F1B16" stroke-width="1" />
    <text x="0" y="35" class="mono" font-size="11.5" font-weight="600" fill="#6B6458" letter-spacing="1">THE FIRST LEAF / A PERIODICAL OF MEMORY</text>
    <text x="1320" y="35" text-anchor="end" class="sans" font-size="12" font-weight="700" fill="#C5A878" letter-spacing="1.5">SCROLL TO INSPECT ↓</text>
  </g>
</svg>'''
    return svg

print("Template 2 code appended.")
# Template 3 generator: This Day in Technology (10 September Timeline)
def generate_t3():
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1440 2950" width="1440" height="2950">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&amp;family=Playfair+Display:ital,wght@0,400;0,700;1,400&amp;family=IBM+Plex+Mono:wght@400;500;600&amp;family=Inter:wght@400;500;600;700&amp;display=swap');
      .serif-display { font-family: 'Cinzel', 'Playfair Display', Georgia, serif; }
      .serif-body { font-family: 'Playfair Display', Georgia, serif; }
      .mono { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
      .sans { font-family: 'Inter', -apple-system, sans-serif; }
    </style>
    <linearGradient id="timelineAxisGlow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E63946" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#3A3A42" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#E63946" stop-opacity="0.8" />
    </linearGradient>
    <radialGradient id="featuredPulse" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#E63946" stop-opacity="0.9" />
      <stop offset="60%" stop-color="#E63946" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#E63946" stop-opacity="0" />
    </radialGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="#000000" flood-opacity="0.8" />
    </filter>
  </defs>

  <!-- Canvas Background -->
  <rect id="Canvas_Background" width="1440" height="2950" fill="#0A0A0D" />
  
  <!-- Subtle Grid Lines -->
  <g id="Subtle_Grid" opacity="0.12">
    <line x1="120" y1="0" x2="120" y2="2950" stroke="#FFFFFF" stroke-width="0.5" />
    <line x1="720" y1="0" x2="720" y2="2950" stroke="#FFFFFF" stroke-width="0.5" />
    <line x1="1320" y1="0" x2="1320" y2="2950" stroke="#FFFFFF" stroke-width="0.5" />
  </g>

  <!-- Top Navigation Header -->
  <g id="Top_Header" transform="translate(100, 50)">
    <text x="0" y="20" class="mono" font-size="12" font-weight="600" fill="#8E8E93" letter-spacing="2">OD / OHM • TECHNOLOGY DISPATCH</text>
    <text x="1240" y="20" text-anchor="end" class="sans" font-size="12" font-weight="600" fill="#8E8E93" letter-spacing="2">HISTORICAL INDEX • VOL. IV</text>
    <line x1="0" y1="35" x2="1240" y2="35" stroke="#222228" stroke-width="1" />
  </g>

  <!-- Hero Header Section -->
  <g id="Hero_Header" transform="translate(100, 130)">
    <!-- Left Hero Column -->
    <g id="Hero_Left">
      <!-- Huge Numeral 10 -->
      <text x="0" y="130" class="serif-display" font-size="150" font-weight="900" fill="#F8F8FA" letter-spacing="-2">10</text>
      <!-- Month SEPTEMBER -->
      <text x="0" y="200" class="serif-display" font-size="44" font-weight="800" fill="#FFFFFF" letter-spacing="6">SEPTEMBER</text>
      <line x1="0" y1="218" x2="380" y2="218" stroke="#E63946" stroke-width="2.5" />
      
      <!-- Sub-headline -->
      <text x="0" y="255" class="serif-body" font-size="24" font-style="italic" fill="#FF4D4D" letter-spacing="0.5">This Day in Technology</text>
      <text x="0" y="295" class="sans" font-size="15" fill="#A0A0A8">
        <tspan x="0" y="295">Explore the breakthroughs, launches and inventions that</tspan>
        <tspan x="0" y="320">took place on this date across the history of technology.</tspan>
      </text>

      <!-- Stats Pill Bar -->
      <g transform="translate(0, 355)" class="mono" font-size="11" font-weight="600" fill="#E63946">
        <text x="0" y="0">10 EVENTS</text>
        <circle cx="90" cy="-4" r="2.5" fill="#666670" />
        <text x="105" y="0">2015 — 2022</text>
        <circle cx="210" cy="-4" r="2.5" fill="#666670" />
        <text x="225" y="0">8 DISCIPLINES</text>
      </g>

      <!-- Drop-Cap Opening Paragraph -->
      <g transform="translate(0, 400)">
        <text x="0" y="48" class="serif-display" font-size="64" font-weight="900" fill="#E63946">S</text>
        <text class="sans" font-size="14.5" fill="#CCCCCC" line-height="1.6">
          <tspan x="48" y="22">eptember 10 has witnessed a series of pivotal moments in</tspan>
          <tspan x="48" y="46">the evolution of modern technology, from early computing</tspan>
          <tspan x="0" y="74">breakthroughs to the foundational tools shaping how our global</tspan>
          <tspan x="0" y="98">network connects, reasons, and computes today.</tspan>
        </text>
      </g>
    </g>

    <!-- Right Hero Column: Telemetry Box -->
    <g id="Hero_Telemetry_Right" transform="translate(790, 20)">
      <rect x="0" y="0" width="450" height="280" fill="#111116" stroke="#22222A" stroke-width="1.5" rx="2" />
      
      <!-- Tech Corner Brackets (Red) -->
      <path d="M 0 25 L 0 0 L 25 0" fill="none" stroke="#E63946" stroke-width="2.5" />
      <path d="M 425 0 L 450 0 L 450 25" fill="none" stroke="#E63946" stroke-width="2.5" />
      <path d="M 0 255 L 0 280 L 25 280" fill="none" stroke="#E63946" stroke-width="2.5" />
      <path d="M 425 280 L 450 280 L 450 255" fill="none" stroke="#E63946" stroke-width="2.5" />

      <g transform="translate(30, 45)">
        <text x="0" y="0" class="mono" font-size="12" font-weight="700" fill="#E63946" letter-spacing="2">REC NO. 0910 // TECH ARCHIVE</text>
        <text x="0" y="30" class="sans" font-size="18" font-weight="700" fill="#FFFFFF">Chronological Telemetry Stream</text>
        <text x="0" y="60" class="sans" font-size="13" fill="#8E8E93">Active timeline spanning artificial intelligence, deep sea bandwidth, submicron silicon, and orbital exploration.</text>
        
        <!-- Mini radar / status lines -->
        <g transform="translate(0, 100)" class="mono" font-size="11" fill="#7A7A82">
          <line x1="0" y1="0" x2="390" y2="0" stroke="#22222A" stroke-width="1" />
          <text x="0" y="24">INDEX RANGE : 2015 - 2022</text>
          <text x="240" y="24" fill="#E63946">STATUS : VERIFIED</text>
          <text x="0" y="52">SAMPLING DENSITY : 8 EPOCHS</text>
          <text x="240" y="52">NETWORK : GLOBAL</text>
          <line x1="0" y1="70" x2="390" y2="70" stroke="#22222A" stroke-width="1" />
        </g>
      </g>
    </g>
  </g>

  <!-- Filter Pills Navigation Bar -->
  <g id="Filter_Pills" transform="translate(100, 690)">
    <!-- Pill 1: ALL (Active Red) -->
    <rect x="0" y="0" width="62" height="32" fill="#E63946" rx="3" />
    <text x="31" y="20" text-anchor="middle" class="sans" font-size="11" font-weight="700" fill="#FFFFFF" letter-spacing="1">ALL</text>

    <!-- Pill 2: AI -->
    <rect x="74" y="0" width="55" height="32" fill="#14141A" stroke="#282832" stroke-width="1" rx="3" />
    <text x="101" y="20" text-anchor="middle" class="sans" font-size="11" font-weight="600" fill="#A0A0AA" letter-spacing="1">AI</text>

    <!-- Pill 3: COMPUTING -->
    <rect x="141" y="0" width="110" height="32" fill="#14141A" stroke="#282832" stroke-width="1" rx="3" />
    <text x="196" y="20" text-anchor="middle" class="sans" font-size="11" font-weight="600" fill="#A0A0AA" letter-spacing="1">COMPUTING</text>

    <!-- Pill 4: INTERNET -->
    <rect x="263" y="0" width="95" height="32" fill="#14141A" stroke="#282832" stroke-width="1" rx="3" />
    <text x="310" y="20" text-anchor="middle" class="sans" font-size="11" font-weight="600" fill="#A0A0AA" letter-spacing="1">INTERNET</text>

    <!-- Pill 5: MOBILE -->
    <rect x="370" y="0" width="85" height="32" fill="#14141A" stroke="#282832" stroke-width="1" rx="3" />
    <text x="412" y="20" text-anchor="middle" class="sans" font-size="11" font-weight="600" fill="#A0A0AA" letter-spacing="1">MOBILE</text>

    <!-- Pill 6: NETWORK -->
    <rect x="467" y="0" width="95" height="32" fill="#14141A" stroke="#282832" stroke-width="1" rx="3" />
    <text x="514" y="20" text-anchor="middle" class="sans" font-size="11" font-weight="600" fill="#A0A0AA" letter-spacing="1">NETWORK</text>

    <!-- Pill 7: TELECOMM -->
    <rect x="574" y="0" width="105" height="32" fill="#14141A" stroke="#282832" stroke-width="1" rx="3" />
    <text x="626" y="20" text-anchor="middle" class="sans" font-size="11" font-weight="600" fill="#A0A0AA" letter-spacing="1">TELECOMM</text>

    <!-- Pill 8: WEB -->
    <rect x="691" y="0" width="65" height="32" fill="#14141A" stroke="#282832" stroke-width="1" rx="3" />
    <text x="723" y="20" text-anchor="middle" class="sans" font-size="11" font-weight="600" fill="#A0A0AA" letter-spacing="1">WEB</text>

    <!-- Pill 9: SEMICONDUCTORS -->
    <rect x="768" y="0" width="155" height="32" fill="#14141A" stroke="#282832" stroke-width="1" rx="3" />
    <text x="845" y="20" text-anchor="middle" class="sans" font-size="11" font-weight="600" fill="#A0A0AA" letter-spacing="1">SEMICONDUCTORS</text>
  </g>

  <!-- Timeline Header Year Range -->
  <g id="Timeline_Header_Range" transform="translate(100, 760)">
    <text x="0" y="30" class="serif-display" font-size="36" font-weight="900" fill="#FFFFFF" letter-spacing="2">2015 — 2022</text>
    <line x1="0" y1="45" x2="1240" y2="45" stroke="#E63946" stroke-width="1.8" />
  </g>

  <!-- Central Vertical Timeline Axis -->
  <g id="Timeline_Axis">
    <!-- Center Axis Line -->
    <line x1="720" y1="830" x2="720" y2="2650" stroke="url(#timelineAxisGlow)" stroke-width="2" />
  </g>

  <!-- Timeline Events (8 Nodes Alternating Left / Right) -->
  <g id="Timeline_Events">
    
    <!-- 1. 2015 (Left, y: 840) -->
    <g id="Event_2015" transform="translate(140, 840)">
      <g transform="translate(180, 0)">
        <text x="360" y="15" text-anchor="end" class="sans" font-size="11.5" font-weight="800" fill="#E63946" letter-spacing="1.5">COMPUTING</text>
        <text x="360" y="55" text-anchor="end" class="serif-display" font-size="44" font-weight="900" fill="#FFFFFF">2015</text>
        <text x="360" y="85" text-anchor="end" class="sans" font-size="16" font-weight="700" fill="#FFFFFF">Machine Learning Framework Open-Sourced</text>
        <text x="360" y="112" text-anchor="end" class="sans" font-size="13" fill="#8E8E93">A foundational deep learning framework is released open-source,</text>
        <text x="360" y="132" text-anchor="end" class="sans" font-size="13" fill="#8E8E93">accelerating scalable neural network research worldwide.</text>
      </g>
      <!-- Connection line to center axis (x=720 -> relative x=580) -->
      <line x1="540" y1="45" x2="580" y2="45" stroke="#E63946" stroke-width="1.5" stroke-dasharray="3 3" />
      <circle cx="580" cy="45" r="5" fill="#E63946" />
    </g>

    <!-- 2. 2016 (Right, y: 1040) -->
    <g id="Event_2016" transform="translate(720, 1040)">
      <!-- Node on central line -->
      <circle cx="0" cy="45" r="5" fill="#E63946" />
      <line x1="0" y1="45" x2="40" y2="45" stroke="#E63946" stroke-width="1.5" stroke-dasharray="3 3" />
      <g transform="translate(60, 0)">
        <text x="0" y="15" class="sans" font-size="11.5" font-weight="800" fill="#E63946" letter-spacing="1.5">NETWORK</text>
        <text x="0" y="55" class="serif-display" font-size="44" font-weight="900" fill="#FFFFFF">2016</text>
        <text x="0" y="85" class="sans" font-size="16" font-weight="700" fill="#FFFFFF">Subsea Cable Network Reaches Milestone</text>
        <text x="0" y="112" class="sans" font-size="13" fill="#8E8E93">A transoceanic fiber line completes, routing terabits between</text>
        <text x="0" y="132" class="sans" font-size="13" fill="#8E8E93">continents and dramatically expanding global bandwidth.</text>
      </g>
    </g>

    <!-- 3. 2017 (Left, y: 1240) -->
    <g id="Event_2017" transform="translate(140, 1240)">
      <g transform="translate(180, 0)">
        <text x="360" y="15" text-anchor="end" class="sans" font-size="11.5" font-weight="800" fill="#E63946" letter-spacing="1.5">MOBILE</text>
        <text x="360" y="55" text-anchor="end" class="serif-display" font-size="44" font-weight="900" fill="#FFFFFF">2017</text>
        <text x="360" y="85" text-anchor="end" class="sans" font-size="16" font-weight="700" fill="#FFFFFF">Edge-to-Edge Smartphone Display Debuts</text>
        <text x="360" y="112" text-anchor="end" class="sans" font-size="13" fill="#8E8E93">A flagship device popularizes bezel-less OLED panels,</text>
        <text x="360" y="132" text-anchor="end" class="sans" font-size="13" fill="#8E8E93">ushering in modern gesture-driven mobile interaction.</text>
      </g>
      <line x1="540" y1="45" x2="580" y2="45" stroke="#E63946" stroke-width="1.5" stroke-dasharray="3 3" />
      <circle cx="580" cy="45" r="5" fill="#E63946" />
    </g>

    <!-- 4. 2018 (Right, y: 1440) -->
    <g id="Event_2018" transform="translate(720, 1440)">
      <circle cx="0" cy="45" r="5" fill="#E63946" />
      <line x1="0" y1="45" x2="40" y2="45" stroke="#E63946" stroke-width="1.5" stroke-dasharray="3 3" />
      <g transform="translate(60, 0)">
        <text x="0" y="15" class="sans" font-size="11.5" font-weight="800" fill="#E63946" letter-spacing="1.5">SOFTWARE</text>
        <text x="0" y="55" class="serif-display" font-size="44" font-weight="900" fill="#FFFFFF">2018</text>
        <text x="0" y="85" class="sans" font-size="16" font-weight="700" fill="#FFFFFF">Container Platform Reaches Version 1.0</text>
        <text x="0" y="112" class="sans" font-size="13" fill="#8E8E93">The open-source container engine achieves GA release,</text>
        <text x="0" y="132" class="sans" font-size="13" fill="#8E8E93">becoming the bedrock of modern cloud-native infrastructure.</text>
      </g>
    </g>

    <!-- 5. 2019 (Left, y: 1640) -->
    <g id="Event_2019" transform="translate(140, 1640)">
      <g transform="translate(180, 0)">
        <text x="360" y="15" text-anchor="end" class="sans" font-size="11.5" font-weight="800" fill="#E63946" letter-spacing="1.5">CYBER &amp; PRIVACY</text>
        <text x="360" y="55" text-anchor="end" class="serif-display" font-size="44" font-weight="900" fill="#FFFFFF">2019</text>
        <text x="360" y="85" text-anchor="end" class="sans" font-size="16" font-weight="700" fill="#FFFFFF">Landmark Data Protection Law Takes Effect</text>
        <text x="360" y="112" text-anchor="end" class="sans" font-size="13" fill="#8E8E93">Sweeping privacy regulations reshape how tech companies</text>
        <text x="360" y="132" text-anchor="end" class="sans" font-size="13" fill="#8E8E93">collect, store, and transfer user data globally.</text>
      </g>
      <line x1="540" y1="45" x2="580" y2="45" stroke="#E63946" stroke-width="1.5" stroke-dasharray="3 3" />
      <circle cx="580" cy="45" r="5" fill="#E63946" />
    </g>

    <!-- 6. 2020 (Right, y: 1840) — FEATURED HIGHLIGHT CARD -->
    <g id="Event_2020_Featured" transform="translate(720, 1840)">
      <!-- Pulse Rings on Central Axis -->
      <circle cx="0" cy="80" r="22" fill="none" stroke="#E63946" stroke-width="1" opacity="0.4" />
      <circle cx="0" cy="80" r="14" fill="none" stroke="#E63946" stroke-width="1.8" />
      <circle cx="0" cy="80" r="6" fill="#E63946" />
      <line x1="0" y1="80" x2="40" y2="80" stroke="#E63946" stroke-width="2" />

      <!-- Framed Highlight Card -->
      <g transform="translate(50, 0)" filter="url(#cardShadow)">
        <rect x="0" y="0" width="540" height="160" fill="#141419" stroke="#E63946" stroke-width="2" rx="3" />
        
        <!-- Corner ticks -->
        <line x1="0" y1="12" x2="12" y2="0" stroke="#E63946" stroke-width="2" />
        <line x1="540" y1="148" x2="528" y2="160" stroke="#E63946" stroke-width="2" />

        <g transform="translate(30, 25)">
          <text x="0" y="10" class="sans" font-size="11" font-weight="800" fill="#FF4D4D" letter-spacing="2">ARTIFICIAL INTELLIGENCE • PIVOTAL</text>
          <text x="0" y="55" class="serif-display" font-size="46" font-weight="900" fill="#FFFFFF">2020</text>
          <text x="0" y="85" class="sans" font-size="17" font-weight="700" fill="#FFFFFF">Large-Scale Language Model Unveiled</text>
          <text x="0" y="112" class="sans" font-size="13" fill="#A0A0A8">A parameter-breakthrough model demonstrates unprecedented</text>
          <text x="0" y="130" class="sans" font-size="13" fill="#A0A0A8">zero-shot reasoning across natural language tasks.</text>
        </g>
      </g>
    </g>

    <!-- 7. 2021 (Left, y: 2060) -->
    <g id="Event_2021" transform="translate(140, 2060)">
      <g transform="translate(180, 0)">
        <text x="360" y="15" text-anchor="end" class="sans" font-size="11.5" font-weight="800" fill="#E63946" letter-spacing="1.5">SPACE</text>
        <text x="360" y="55" text-anchor="end" class="serif-display" font-size="44" font-weight="900" fill="#FFFFFF">2021</text>
        <text x="360" y="85" text-anchor="end" class="sans" font-size="16" font-weight="700" fill="#FFFFFF">Private Orbital Capsule's First Flight</text>
        <text x="360" y="112" text-anchor="end" class="sans" font-size="13" fill="#8E8E93">A non-governmental aerospace team completes its first</text>
        <text x="360" y="132" text-anchor="end" class="sans" font-size="13" fill="#8E8E93">all-civilian orbital mission, opening a new era in spaceflight.</text>
      </g>
      <line x1="540" y1="45" x2="580" y2="45" stroke="#E63946" stroke-width="1.5" stroke-dasharray="3 3" />
      <circle cx="580" cy="45" r="5" fill="#E63946" />
    </g>

    <!-- 8. 2022 (Right, y: 2260) -->
    <g id="Event_2022" transform="translate(720, 2260)">
      <circle cx="0" cy="45" r="5" fill="#E63946" />
      <line x1="0" y1="45" x2="40" y2="45" stroke="#E63946" stroke-width="1.5" stroke-dasharray="3 3" />
      <g transform="translate(60, 0)">
        <text x="0" y="15" class="sans" font-size="11.5" font-weight="800" fill="#E63946" letter-spacing="1.5">SEMICONDUCTOR</text>
        <text x="0" y="55" class="serif-display" font-size="44" font-weight="900" fill="#FFFFFF">2022</text>
        <text x="0" y="85" class="sans" font-size="16" font-weight="700" fill="#FFFFFF">Next-Gen Chip Architecture Announced</text>
        <text x="0" y="112" class="sans" font-size="13" fill="#8E8E93">A revolutionary 3nm silicon design promises major efficiency</text>
        <text x="0" y="132" class="sans" font-size="13" fill="#8E8E93">gains, powering modern high-performance cloud computing.</text>
      </g>
    </g>
  </g>

  <!-- Footer Section -->
  <g id="Footer_Section" transform="translate(100, 2680)">
    <line x1="0" y1="0" x2="1240" y2="0" stroke="#222228" stroke-width="1" />
    
    <!-- Sources Left -->
    <g transform="translate(0, 35)" class="sans" font-size="11" fill="#7A7A82">
      <text x="0" y="0" font-weight="700" fill="#E63946" letter-spacing="1">PRIMARY SOURCES &amp; ARCHIVES</text>
      <text x="0" y="24">IEEE Archives, Computer History Museum</text>
      <text x="0" y="44">Wired Tech Retrospective, Global Telemetry Monitor</text>
    </g>

    <!-- Catchphrase Center/Right -->
    <g transform="translate(620, 35)">
      <text x="0" y="10" class="serif-body" font-size="22" font-weight="400" fill="#E0E0E6">One date. Many years.</text>
      <text x="0" y="38" class="serif-body" font-size="22" font-weight="400" fill="#E0E0E6">One continuous story of technology.</text>
    </g>

    <!-- Bottom Bar -->
    <g transform="translate(0, 160)">
      <line x1="0" y1="0" x2="1240" y2="0" stroke="#1A1A20" stroke-width="1" />
      <text x="0" y="30" class="mono" font-size="11" font-weight="600" fill="#5A5A62" letter-spacing="1">OD / OHM ENTERPRISE</text>
      <text x="620" y="30" text-anchor="middle" class="mono" font-size="11" font-weight="600" fill="#5A5A62" letter-spacing="1">10 SEPTEMBER / TECH ARCHIVE</text>
      <text x="1240" y="30" text-anchor="end" class="mono" font-size="11" font-weight="600" fill="#5A5A62" letter-spacing="1">PAGE 01</text>
    </g>
  </g>
</svg>'''
    return svg

print("Template 3 code appended.")
# Template 4 generator: One Day, One Year Homepage
def generate_t4(mc_uri):
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1440 3300" width="1440" height="3300">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&amp;family=Playfair+Display:ital,wght@0,400;0,700;1,400&amp;family=IBM+Plex+Mono:wght@400;500;600&amp;family=Inter:wght@400;500;600;700&amp;display=swap');
      .serif-display {{ font-family: 'Cinzel', 'Playfair Display', Georgia, serif; }}
      .serif-body {{ font-family: 'Playfair Display', Georgia, serif; }}
      .mono {{ font-family: 'IBM Plex Mono', 'Courier New', monospace; }}
      .sans {{ font-family: 'Inter', -apple-system, sans-serif; }}
    </style>
    <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EED7A1" />
      <stop offset="100%" stop-color="#B89355" />
    </linearGradient>
    <radialGradient id="orbitGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFEAA7" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#D4AF37" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#D4AF37" stop-opacity="0" />
    </radialGradient>
    <filter id="heroCardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.9" />
    </filter>
  </defs>

  <!-- Canvas Background -->
  <rect id="Canvas_Background" width="1440" height="3300" fill="#09090C" />

  <!-- Top Navigation Header -->
  <g id="Top_Navigation" transform="translate(80, 50)">
    <text x="0" y="22" class="serif-display" font-size="22" font-weight="700" fill="#F0ECE1" letter-spacing="1">One Day, One Year</text>
    <text x="1280" y="20" text-anchor="end" class="sans" font-size="12" font-weight="600" fill="#A8A096" letter-spacing="2">
      <tspan dx="0">ARCHIVE</tspan>
      <tspan dx="35">ABOUT</tspan>
      <tspan dx="35">SIGN IN</tspan>
    </text>
    <line x1="0" y1="40" x2="1280" y2="40" stroke="#1F1E24" stroke-width="1" />
  </g>

  <!-- Section 1: Hero Block -->
  <g id="Section_Hero" transform="translate(80, 150)">
    <!-- Left Hero Column -->
    <g id="Hero_Left_Content">
      <text x="0" y="30" class="mono" font-size="11" font-weight="600" fill="#B89355" letter-spacing="2">PUBLIC ARCHIVES RECORD</text>
      <text x="0" y="115" class="serif-display" font-size="82" font-weight="900" fill="#F0ECE1" letter-spacing="2">One Day,</text>
      <text x="0" y="200" class="serif-display" font-size="82" font-weight="900" fill="#F0ECE1" letter-spacing="2">One Year</text>
      <text x="0" y="250" class="serif-body" font-size="18" fill="#A8A096" letter-spacing="0.5">Explore a single day, drawn from history.</text>
      <text x="0" y="300" class="sans" font-size="12" font-weight="600" fill="#6E685E" letter-spacing="2">SCROLL TO DISCOVER ↓</text>

      <!-- Specimen Tiles Matrix in Backdrop -->
      <g id="Specimen_Tiles_Grid" transform="translate(0, 340)" opacity="0.65">
        <rect x="0" y="0" width="620" height="180" fill="#121217" stroke="#22222A" stroke-width="1" rx="4" />
        <!-- Mock specimen documents inside -->
        <rect x="20" y="20" width="120" height="140" fill="#1C1C24" stroke="#33333E" stroke-width="0.8" rx="2" />
        <line x1="35" y1="45" x2="125" y2="45" stroke="#6E685E" stroke-width="2" />
        <line x1="35" y1="65" x2="115" y2="65" stroke="#444450" stroke-width="1" />
        <line x1="35" y1="80" x2="120" y2="80" stroke="#444450" stroke-width="1" />
        <line x1="35" y1="95" x2="100" y2="95" stroke="#444450" stroke-width="1" />
        
        <rect x="160" y="20" width="120" height="140" fill="#1C1C24" stroke="#33333E" stroke-width="0.8" rx="2" />
        <circle cx="220" cy="70" r="30" fill="#282835" />
        <line x1="175" y1="120" x2="265" y2="120" stroke="#444450" stroke-width="1" />
        <line x1="175" y1="135" x2="245" y2="135" stroke="#444450" stroke-width="1" />

        <rect x="300" y="20" width="120" height="140" fill="#1C1C24" stroke="#33333E" stroke-width="0.8" rx="2" />
        <rect x="320" y="40" width="80" height="50" fill="#2A2A38" />
        <line x1="315" y1="110" x2="405" y2="110" stroke="#444450" stroke-width="1" />

        <rect x="440" y="20" width="160" height="140" fill="#181820" stroke="#33333E" stroke-width="0.8" rx="2" />
        <circle cx="520" cy="80" r="35" fill="none" stroke="#B89355" stroke-width="1" stroke-dasharray="3 3" />
        <circle cx="520" cy="80" r="6" fill="#B89355" />
      </g>
    </g>

    <!-- Right Hero Column: Interactive Date Selector Widget -->
    <g id="Hero_Date_Picker_Widget" transform="translate(760, 20)" filter="url(#heroCardShadow)">
      <!-- Outer Card Frame -->
      <rect x="0" y="0" width="520" height="480" fill="#111116" stroke="#252530" stroke-width="1.5" rx="8" />

      <g transform="translate(260, 190)">
        <!-- Circular Dial Wheel with Dashed Ring -->
        <circle cx="0" cy="0" r="110" fill="#0C0C10" stroke="#2A2A36" stroke-width="1.5" />
        <circle cx="0" cy="0" r="95" fill="none" stroke="#B89355" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.85" />
        
        <!-- Radial tick marks -->
        <g stroke="#4A4A58" stroke-width="1">
          <line x1="0" y1="-105" x2="0" y2="-95" />
          <line x1="74" y1="-74" x2="67" y2="-67" />
          <line x1="105" y1="0" x2="95" y2="0" />
          <line x1="74" y1="74" x2="67" y2="67" />
          <line x1="0" y1="105" x2="0" y2="95" />
          <line x1="-74" y1="74" x2="-67" y2="67" />
          <line x1="-105" y1="0" x2="-95" y2="0" />
          <line x1="-74" y1="-74" x2="-67" y2="-67" />
        </g>

        <!-- Numbers 09, 10 (Selected), 11 -->
        <text x="-58" y="16" text-anchor="middle" class="serif-display" font-size="34" font-weight="700" fill="#5A5A68">09</text>
        
        <!-- Highlighted Active Number 10 -->
        <circle cx="0" cy="0" r="38" fill="#1C1C24" stroke="#B89355" stroke-width="2" />
        <text x="0" y="18" text-anchor="middle" class="serif-display" font-size="52" font-weight="900" fill="#FFFFFF">10</text>
        
        <text x="58" y="16" text-anchor="middle" class="serif-display" font-size="34" font-weight="700" fill="#5A5A68">11</text>
      </g>

      <!-- Month Selector Row -->
      <g transform="translate(260, 360)">
        <text x="-120" y="6" class="sans" font-size="18" font-weight="700" fill="#6A6A78">‹</text>
        <text x="0" y="6" text-anchor="middle" class="serif-display" font-size="20" font-weight="800" fill="#F0ECE1" letter-spacing="4">SEPTEMBER</text>
        <text x="120" y="6" class="sans" font-size="18" font-weight="700" fill="#6A6A78">›</text>
      </g>

      <!-- View Today Button -->
      <g transform="translate(140, 405)">
        <rect x="0" y="0" width="240" height="44" fill="#16161E" stroke="#B89355" stroke-width="1.5" rx="3" />
        <text x="120" y="27" text-anchor="middle" class="sans" font-size="11.5" font-weight="700" fill="#EED7A1" letter-spacing="1.5">VIEW AND SEE TODAY →</text>
      </g>
    </g>
  </g>

  <!-- Section 2: Five Moments. One Date. -->
  <g id="Section_Five_Moments" transform="translate(80, 780)">
    <text x="0" y="30" class="serif-display" font-size="28" font-weight="700" fill="#F0ECE1" letter-spacing="1">Five moments. One date.</text>
    <text x="1280" y="25" text-anchor="end" class="sans" font-size="12" font-weight="600" fill="#B89355" letter-spacing="1.5">BROWSE HISTORICAL EVENTS →</text>

    <!-- 5 Horizontal Cards (Gap 20, width 240 each) -->
    <g id="Cards_Container" transform="translate(0, 60)">
      <!-- Card 1: 1775 -->
      <g id="Moment_1775" transform="translate(0, 0)">
        <rect x="0" y="0" width="240" height="240" fill="#111116" stroke="#252530" stroke-width="1" rx="4" />
        <rect x="15" y="15" width="210" height="110" fill="#1E1E26" rx="2" />
        <!-- Mock sketch inside card -->
        <circle cx="120" cy="70" r="28" fill="#2A2A38" />
        <text x="20" y="165" class="serif-display" font-size="28" font-weight="800" fill="#FFFFFF">1775</text>
        <text x="20" y="195" class="sans" font-size="12" fill="#8E8E98">The Royal Society Charter</text>
      </g>

      <!-- Card 2: 1813 -->
      <g id="Moment_1813" transform="translate(260, 0)">
        <rect x="0" y="0" width="240" height="240" fill="#111116" stroke="#252530" stroke-width="1" rx="4" />
        <rect x="15" y="15" width="210" height="110" fill="#1E1E26" rx="2" />
        <polygon points="40,105 120,40 200,105" fill="#2A2A38" />
        <text x="20" y="165" class="serif-display" font-size="28" font-weight="800" fill="#FFFFFF">1813</text>
        <text x="20" y="195" class="sans" font-size="12" fill="#8E8E98">The Battle of Lake Erie</text>
      </g>

      <!-- Card 3: 1945 (Active Highlight Card) -->
      <g id="Moment_1945_Active" transform="translate(520, 0)">
        <rect x="0" y="0" width="240" height="240" fill="#161620" stroke="#C5A878" stroke-width="2" rx="4" />
        <rect x="15" y="15" width="210" height="110" fill="#252328" rx="2" />
        <!-- Crowd sketch -->
        <rect x="30" y="45" width="180" height="60" fill="#38333D" />
        <text x="20" y="165" class="serif-display" font-size="32" font-weight="900" fill="#FFFFFF">1945</text>
        <rect x="120" y="146" width="105" height="22" fill="#2E251A" stroke="#C5A878" stroke-width="1" rx="2" />
        <text x="172" y="161" text-anchor="middle" class="mono" font-size="9.5" font-weight="700" fill="#EED7A1">1,450 DAYS AGO</text>
        <text x="20" y="195" class="sans" font-size="12" fill="#B8B0A2">Global Peace Declaration</text>
      </g>

      <!-- Card 4: 2001 -->
      <g id="Moment_2001" transform="translate(780, 0)">
        <rect x="0" y="0" width="240" height="240" fill="#111116" stroke="#252530" stroke-width="1" rx="4" />
        <rect x="15" y="15" width="210" height="110" fill="#1E1E26" rx="2" />
        <ellipse cx="120" cy="70" rx="60" ry="25" fill="#2A2A38" />
        <text x="20" y="165" class="serif-display" font-size="28" font-weight="800" fill="#FFFFFF">2001</text>
        <text x="20" y="195" class="sans" font-size="12" fill="#8E8E98">The Human Genome Assembly</text>
      </g>

      <!-- Card 5: 2026 -->
      <g id="Moment_2026" transform="translate(1040, 0)">
        <rect x="0" y="0" width="240" height="240" fill="#111116" stroke="#252530" stroke-width="1" rx="4" />
        <rect x="15" y="15" width="210" height="110" fill="#1E1E26" rx="2" />
        <circle cx="120" cy="70" r="35" fill="none" stroke="#4A4A60" stroke-width="2" />
        <text x="20" y="165" class="serif-display" font-size="28" font-weight="800" fill="#FFFFFF">2026</text>
        <text x="20" y="195" class="sans" font-size="12" fill="#8E8E98">Next-Gen Quantum Network</text>
      </g>
    </g>
  </g>

  <!-- Section 3: Feature Moment 1969 Apollo Moon Landing -->
  <g id="Section_Feature_1969" transform="translate(80, 1160)">
    <!-- Left Photo: NASA Mission Control Room -->
    <g id="Feature_Photo_Left">
      <rect x="0" y="0" width="700" height="420" fill="#141419" stroke="#252530" stroke-width="1.5" rx="4" />
      {f'<image href="{mc_uri}" x="6" y="6" width="688" height="408" preserveAspectRatio="xMidYMid slice" rx="3" />' if mc_uri else '''
      <rect x="6" y="6" width="688" height="408" fill="#1C1C24" />
      <text x="350" y="210" text-anchor="middle" class="sans" font-size="18" fill="#8E8E98">[NASA APOLLO MISSION CONTROL - 1969]</text>
      '''}
    </g>

    <!-- Right Copy: Story & Call to Action -->
    <g id="Feature_Story_Right" transform="translate(760, 40)">
      <rect x="0" y="0" width="105" height="26" fill="#1C1914" stroke="#B89355" stroke-width="1" rx="2" />
      <text x="52" y="17" text-anchor="middle" class="mono" font-size="10" font-weight="700" fill="#D4AF37" letter-spacing="1.5">DATE FOCUS</text>

      <text x="0" y="105" class="serif-display" font-size="74" font-weight="900" fill="#FFFFFF" letter-spacing="1">1969</text>
      <text x="0" y="160" class="serif-display" font-size="26" font-weight="700" fill="#F0ECE1" line-height="1.3">
        <tspan x="0" y="160">The moment Earth became</tspan>
        <tspan x="0" y="195">a distant world</tspan>
      </text>

      <text class="serif-body" font-size="15.5" fill="#A8A096" line-height="1.6">
        <tspan x="0" y="250">On this day, a room full of voices carried humanity beyond</tspan>
        <tspan x="0" y="278">the frontier... turning a fragile transmission into collective</tspan>
        <tspan x="0" y="306">memory preserved across centuries.</tspan>
      </text>

      <g transform="translate(0, 360)">
        <text x="0" y="0" class="sans" font-size="13" font-weight="700" fill="#D4AF37" letter-spacing="2">READ STORY →</text>
        <line x1="0" y1="8" x2="130" y2="8" stroke="#D4AF37" stroke-width="1.5" />
      </g>
    </g>
  </g>

  <!-- Section 4: Discover History Everywhere (Celestial Orbits Graphic) -->
  <g id="Section_Discover_Everywhere" transform="translate(80, 1680)">
    <rect x="0" y="0" width="1280" height="340" fill="#101015" stroke="#22222C" stroke-width="1" rx="6" />

    <!-- Left Copy -->
    <g transform="translate(60, 90)">
      <text x="0" y="0" class="mono" font-size="11" font-weight="700" fill="#B89355" letter-spacing="2">TIME &amp; SPACE</text>
      <text x="0" y="45" class="serif-display" font-size="34" font-weight="800" fill="#FFFFFF">Discover history</text>
      <text x="0" y="85" class="serif-display" font-size="34" font-weight="800" fill="#FFFFFF">everywhere.</text>
      <text x="0" y="130" class="sans" font-size="12" font-weight="600" fill="#7A7A88" letter-spacing="1">FIND EVENTS FROM OVER 2,000 YEARS OF HUMAN CIV.</text>
    </g>

    <!-- Right Vector: Intersecting Celestial Orbital Ellipses -->
    <g id="Vector_Celestial_Orbits" transform="translate(880, 170)">
      <!-- Outer Orbit -->
      <ellipse cx="0" cy="0" rx="300" ry="110" fill="none" stroke="#2E2E3E" stroke-width="1.5" />
      <!-- Middle Orbit -->
      <ellipse cx="0" cy="0" rx="240" ry="85" fill="none" stroke="#B89355" stroke-width="1.2" stroke-dasharray="6 4" opacity="0.6" transform="rotate(-15)" />
      <!-- Inner Orbit -->
      <ellipse cx="0" cy="0" rx="160" ry="60" fill="none" stroke="#444458" stroke-width="1" transform="rotate(25)" />

      <!-- Glowing Nodes on Orbits -->
      <g transform="translate(-140, -40)">
        <circle cx="0" cy="0" r="16" fill="url(#orbitGlow)" />
        <circle cx="0" cy="0" r="4" fill="#FFEAA7" />
      </g>
      <g transform="translate(180, 30)">
        <circle cx="0" cy="0" r="16" fill="url(#orbitGlow)" />
        <circle cx="0" cy="0" r="4" fill="#FFEAA7" />
      </g>
      <g transform="translate(40, -70)">
        <circle cx="0" cy="0" r="12" fill="url(#orbitGlow)" />
        <circle cx="0" cy="0" r="3.5" fill="#FFEAA7" />
      </g>
      <g transform="translate(-60, 55)">
        <circle cx="0" cy="0" r="12" fill="url(#orbitGlow)" />
        <circle cx="0" cy="0" r="3.5" fill="#FFEAA7" />
      </g>
    </g>
  </g>

  <!-- Section 5: Born / Died on this day & Ask the Historian -->
  <g id="Section_Profiles_And_Historian" transform="translate(80, 2100)">
    <!-- Left Column: Born / Died Profiles -->
    <g id="Profiles_Left">
      <text x="0" y="30" class="serif-display" font-size="22" font-weight="700" fill="#F0ECE1">Born / Died on this day</text>
      <text x="700" y="25" text-anchor="end" class="sans" font-size="12" font-weight="600" fill="#B89355" letter-spacing="1">VIEW ALL →</text>

      <!-- 3 Profile Cards -->
      <g id="Profile_Cards" transform="translate(0, 60)">
        <!-- Profile 1: Mary Wollstonecraft -->
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="220" height="280" fill="#111116" stroke="#252530" stroke-width="1" rx="4" />
          <rect x="15" y="15" width="190" height="150" fill="#1F1D24" rx="2" />
          <circle cx="110" cy="90" r="35" fill="#35303E" />
          <text x="20" y="195" class="mono" font-size="10" font-weight="600" fill="#B89355">1759 — 1797</text>
          <text x="20" y="225" class="serif-display" font-size="15" font-weight="700" fill="#FFFFFF">Mary Wollstonecraft</text>
          <text x="20" y="250" class="sans" font-size="11" fill="#7A7A88">Philosopher &amp; Advocate</text>
        </g>

        <!-- Profile 2: José Feliciano -->
        <g transform="translate(240, 0)">
          <rect x="0" y="0" width="220" height="280" fill="#111116" stroke="#252530" stroke-width="1" rx="4" />
          <rect x="15" y="15" width="190" height="150" fill="#1F1D24" rx="2" />
          <circle cx="110" cy="90" r="35" fill="#35303E" />
          <text x="20" y="195" class="mono" font-size="10" font-weight="600" fill="#B89355">1945 — PRESENT</text>
          <text x="20" y="225" class="serif-display" font-size="15" font-weight="700" fill="#FFFFFF">José Feliciano</text>
          <text x="20" y="250" class="sans" font-size="11" fill="#7A7A88">Virtuoso Musician</text>
        </g>

        <!-- Profile 3: Jane Addams -->
        <g transform="translate(480, 0)">
          <rect x="0" y="0" width="220" height="280" fill="#111116" stroke="#252530" stroke-width="1" rx="4" />
          <rect x="15" y="15" width="190" height="150" fill="#1F1D24" rx="2" />
          <circle cx="110" cy="90" r="35" fill="#35303E" />
          <text x="20" y="195" class="mono" font-size="10" font-weight="600" fill="#B89355">1860 — 1935</text>
          <text x="20" y="225" class="serif-display" font-size="15" font-weight="700" fill="#FFFFFF">Jane Addams</text>
          <text x="20" y="250" class="sans" font-size="11" fill="#7A7A88">Nobel Peace Laureate</text>
        </g>
      </g>
    </g>

    <!-- Right Column: Ask the Historian -->
    <g id="Ask_Historian_Right" transform="translate(760, 40)">
      <rect x="0" y="0" width="520" height="300" fill="#111116" stroke="#252530" stroke-width="1.5" rx="6" />
      <g transform="translate(40, 45)">
        <text x="0" y="0" class="mono" font-size="11" font-weight="700" fill="#B89355" letter-spacing="2">AI ARCHIVIST ASSISTANT</text>
        <text x="0" y="40" class="serif-display" font-size="28" font-weight="800" fill="#FFFFFF">Ask the Historian</text>
        <text x="0" y="70" class="sans" font-size="14" fill="#8E8E98">What occurred on this date across centuries? Inquire freely.</text>

        <!-- Search Input Box -->
        <g transform="translate(0, 110)">
          <rect x="0" y="0" width="440" height="52" fill="#181822" stroke="#333342" stroke-width="1" rx="4" />
          <text x="20" y="32" class="sans" font-size="13" fill="#6A6A78">Enter your question, era, or thematic moment...</text>
          <!-- Search Arrow Icon -->
          <circle cx="410" cy="26" r="16" fill="#B89355" />
          <text x="410" y="31" text-anchor="middle" class="sans" font-size="14" font-weight="700" fill="#0C0C10">→</text>
        </g>
      </g>
    </g>
  </g>

  <!-- Footer Section -->
  <g id="Footer_Section" transform="translate(80, 3120)">
    <line x1="0" y1="0" x2="1280" y2="0" stroke="#1F1E24" stroke-width="1" />
    <text x="0" y="50" class="serif-display" font-size="22" font-weight="700" fill="#F0ECE1">One Day, One Year</text>
    <text x="1280" y="50" text-anchor="end" class="mono" font-size="11.5" fill="#7A7A84">
      © 2026 ONE DAY, ONE YEAR • PUBLIC HISTORICAL ARCHIVE
    </text>
  </g>
</svg>'''
    return svg

print("Template 4 code appended.")
# Master Multi-Artboard Canvas Generator
def generate_master_canvas(t1_svg, t2_svg, t3_svg, t4_svg):
    # Extract inner contents of each svg
    def extract_inner(svg_str):
        start = svg_str.find('>', svg_str.find('<svg')) + 1
        end = svg_str.rfind('</svg>')
        return svg_str[start:end]

    c1 = extract_inner(t1_svg)
    c2 = extract_inner(t2_svg)
    c3 = extract_inner(t3_svg)
    c4 = extract_inner(t4_svg)

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 6500 3700" width="6500" height="3700">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&amp;family=Playfair+Display:ital,wght@0,400;0,700;1,400&amp;family=IBM+Plex+Mono:wght@400;500;600&amp;family=Inter:wght@400;500;600;700&amp;display=swap');
      .canvas-title {{ font-family: 'Cinzel', Georgia, serif; font-size: 48px; font-weight: 800; fill: #FFFFFF; letter-spacing: 4px; }}
      .artboard-label {{ font-family: 'Inter', -apple-system, sans-serif; font-size: 24px; font-weight: 700; fill: #B89355; letter-spacing: 2px; }}
      .artboard-sub {{ font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 500; fill: #8E8E98; }}
    </style>
  </defs>

  <!-- Dark Master Figma Workspace Background -->
  <rect width="6500" height="3700" fill="#141416" />

  <!-- Canvas Header Banner -->
  <g id="Workspace_Header" transform="translate(100, 100)">
    <text x="0" y="0" class="canvas-title">ONE DAY, ONE YEAR — FIGMA DESIGN SYSTEM MASTER TEMPLATES</text>
    <text x="0" y="45" font-family="'Inter', sans-serif" font-size="20" fill="#8E8E98">
      Four canonical vector design screens and components for the OneDayOneYear historical archive platform.
    </text>
  </g>

  <!-- Artboard 1: Special Report / Vol. I -->
  <g id="Artboard_01_Special_Report" transform="translate(100, 260)">
    <text x="0" y="-40" class="artboard-label">ARTBOARD 01: SPECIAL REPORT / VOL. I</text>
    <text x="0" y="-15" class="artboard-sub">1440 × 2950 px • Vintage Broadsheet Apollo 11 Dispatch</text>
    <g transform="translate(0, 0)">
      {c1}
    </g>
  </g>

  <!-- Artboard 2: The Archive Opens -->
  <g id="Artboard_02_The_Archive_Opens" transform="translate(1700, 260)">
    <text x="0" y="-40" class="artboard-label">ARTBOARD 02: THE ARCHIVE OPENS</text>
    <text x="0" y="-15" class="artboard-sub">1440 × 2850 px • Cinematic Hero Stage &amp; Scroll Canvas Indicator</text>
    <g transform="translate(0, 0)">
      {c2}
    </g>
  </g>

  <!-- Artboard 3: This Day in Technology -->
  <g id="Artboard_03_Tech_Timeline" transform="translate(3300, 260)">
    <text x="0" y="-40" class="artboard-label">ARTBOARD 03: THIS DAY IN TECHNOLOGY</text>
    <text x="0" y="-15" class="artboard-sub">1440 × 2950 px • 10 September Interactive Technology Timeline</text>
    <g transform="translate(0, 0)">
      {c3}
    </g>
  </g>

  <!-- Artboard 4: One Day, One Year Master Homepage -->
  <g id="Artboard_04_Homepage" transform="translate(4900, 260)">
    <text x="0" y="-40" class="artboard-label">ARTBOARD 04: ONE DAY, ONE YEAR HOMEPAGE</text>
    <text x="0" y="-15" class="artboard-sub">1440 × 3300 px • Master Historical Archive Landing Page &amp; Date Explorer</text>
    <g transform="translate(0, 0)">
      {c4}
    </g>
  </g>
</svg>'''
    return svg

# Component 1: Date Picker Widget
def generate_comp_datepicker():
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 500" width="540" height="500">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&amp;family=Inter:wght@600;700&amp;family=IBM+Plex+Mono:wght@600&amp;display=swap');
      .serif { font-family: 'Cinzel', Georgia, serif; }
      .sans { font-family: 'Inter', -apple-system, sans-serif; }
      .mono { font-family: 'IBM Plex Mono', monospace; }
    </style>
  </defs>
  <rect width="540" height="500" fill="#111116" stroke="#252530" stroke-width="2" rx="10" />
  <g transform="translate(270, 190)">
    <circle cx="0" cy="0" r="110" fill="#0C0C10" stroke="#2A2A36" stroke-width="1.5" />
    <circle cx="0" cy="0" r="95" fill="none" stroke="#B89355" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.85" />
    <g stroke="#4A4A58" stroke-width="1">
      <line x1="0" y1="-105" x2="0" y2="-95" /><line x1="74" y1="-74" x2="67" y2="-67" />
      <line x1="105" y1="0" x2="95" y2="0" /><line x1="74" y1="74" x2="67" y2="67" />
      <line x1="0" y1="105" x2="0" y2="95" /><line x1="-74" y1="74" x2="-67" y2="67" />
      <line x1="-105" y1="0" x2="-95" y2="0" /><line x1="-74" y1="-74" x2="-67" y2="-67" />
    </g>
    <text x="-58" y="16" text-anchor="middle" class="serif" font-size="34" font-weight="700" fill="#5A5A68">09</text>
    <circle cx="0" cy="0" r="38" fill="#1C1C24" stroke="#B89355" stroke-width="2" />
    <text x="0" y="18" text-anchor="middle" class="serif" font-size="52" font-weight="900" fill="#FFFFFF">10</text>
    <text x="58" y="16" text-anchor="middle" class="serif" font-size="34" font-weight="700" fill="#5A5A68">11</text>
  </g>
  <g transform="translate(270, 360)">
    <text x="-120" y="6" class="sans" font-size="18" font-weight="700" fill="#6A6A78">‹</text>
    <text x="0" y="6" text-anchor="middle" class="serif" font-size="20" font-weight="800" fill="#F0ECE1" letter-spacing="4">SEPTEMBER</text>
    <text x="120" y="6" class="sans" font-size="18" font-weight="700" fill="#6A6A78">›</text>
  </g>
  <g transform="translate(150, 410)">
    <rect x="0" y="0" width="240" height="46" fill="#16161E" stroke="#B89355" stroke-width="1.5" rx="3" />
    <text x="120" y="28" text-anchor="middle" class="sans" font-size="12" font-weight="700" fill="#EED7A1" letter-spacing="1.5">VIEW AND SEE TODAY →</text>
  </g>
</svg>'''

# Component 2: Celestial Orbits Map
def generate_comp_celestial():
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 340" width="650" height="340">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFEAA7" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#D4AF37" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#D4AF37" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="650" height="340" fill="#101015" stroke="#22222C" stroke-width="1.5" rx="6" />
  <g transform="translate(325, 170)">
    <ellipse cx="0" cy="0" rx="280" ry="110" fill="none" stroke="#2E2E3E" stroke-width="1.5" />
    <ellipse cx="0" cy="0" rx="220" ry="85" fill="none" stroke="#B89355" stroke-width="1.2" stroke-dasharray="6 4" opacity="0.7" transform="rotate(-15)" />
    <ellipse cx="0" cy="0" rx="150" ry="60" fill="none" stroke="#444458" stroke-width="1" transform="rotate(25)" />
    <g transform="translate(-130, -40)"><circle cx="0" cy="0" r="16" fill="url(#glow)" /><circle cx="0" cy="0" r="4" fill="#FFEAA7" /></g>
    <g transform="translate(170, 30)"><circle cx="0" cy="0" r="16" fill="url(#glow)" /><circle cx="0" cy="0" r="4" fill="#FFEAA7" /></g>
    <g transform="translate(40, -65)"><circle cx="0" cy="0" r="12" fill="url(#glow)" /><circle cx="0" cy="0" r="3.5" fill="#FFEAA7" /></g>
    <g transform="translate(-50, 50)"><circle cx="0" cy="0" r="12" fill="url(#glow)" /><circle cx="0" cy="0" r="3.5" fill="#FFEAA7" /></g>
  </g>
</svg>'''

# Interactive HTML Showcase
def generate_html_viewer():
    return '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>One Day, One Year — Figma Design Templates Showcase</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0D0D11;
      --card-bg: #14141A;
      --border: #23232D;
      --accent-gold: #C5A878;
      --accent-red: #E63946;
      --text: #F2EFE9;
      --muted: #8E8E98;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Inter', -apple-system, sans-serif;
      line-height: 1.5;
      padding-bottom: 80px;
    }
    header {
      padding: 40px 60px;
      border-bottom: 1px solid var(--border);
      background: rgba(13, 13, 17, 0.95);
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(12px);
    }
    .header-content {
      max-width: 1500px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    h1 {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 26px;
      letter-spacing: 2px;
      color: var(--text);
    }
    .subtitle {
      font-size: 14px;
      color: var(--muted);
      margin-top: 4px;
    }
    .nav-tabs {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .tab-btn {
      background: #1A1A24;
      border: 1px solid var(--border);
      color: var(--muted);
      padding: 10px 18px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .tab-btn:hover, .tab-btn.active {
      background: var(--accent-gold);
      color: #0D0D11;
      border-color: var(--accent-gold);
    }
    .main-container {
      max-width: 1500px;
      margin: 40px auto;
      padding: 0 40px;
    }
    .figma-import-guide {
      background: #161620;
      border: 1px solid #302E3C;
      border-radius: 6px;
      padding: 24px 30px;
      margin-bottom: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    .guide-text h2 {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 18px;
      color: var(--accent-gold);
      margin-bottom: 6px;
    }
    .guide-text p {
      font-size: 13.5px;
      color: #A0A0AC;
    }
    .download-all-btn {
      background: var(--accent-gold);
      color: #0D0D11;
      padding: 12px 24px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 13px;
      text-decoration: none;
      letter-spacing: 1px;
    }
    .template-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 50px;
    }
    .card-meta {
      padding: 20px 30px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
    }
    .card-meta h3 {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 20px;
      color: #FFFFFF;
    }
    .card-meta .dims {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      color: var(--accent-gold);
      background: #201E28;
      padding: 4px 10px;
      border-radius: 3px;
    }
    .card-actions a {
      color: var(--accent-gold);
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      border: 1px solid var(--accent-gold);
      padding: 6px 14px;
      border-radius: 3px;
      margin-left: 10px;
    }
    .svg-viewer {
      width: 100%;
      height: 750px;
      overflow: auto;
      background: #08080A;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 20px;
    }
    .svg-viewer object, .svg-viewer img {
      max-width: 100%;
      height: auto;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      border-radius: 4px;
    }
    footer {
      text-align: center;
      padding: 40px;
      border-top: 1px solid var(--border);
      font-size: 13px;
      color: var(--muted);
    }
  </style>
</head>
<body>

  <header>
    <div class="header-content">
      <div>
        <h1>ONE DAY, ONE YEAR — FIGMA DESIGN TEMPLATES</h1>
        <p class="subtitle">Official Vector SVG Design Templates for the Historical Archive Project</p>
      </div>
      <div class="nav-tabs">
        <a href="#t1" class="tab-btn">01 Dispatch Broadsheet</a>
        <a href="#t2" class="tab-btn">02 The Archive Opens</a>
        <a href="#t3" class="tab-btn">03 Tech Timeline</a>
        <a href="#t4" class="tab-btn">04 Master Homepage</a>
        <a href="#canvas" class="tab-btn">All-in-One Canvas</a>
      </div>
    </div>
  </header>

  <div class="main-container">
    <div class="figma-import-guide">
      <div class="guide-text">
        <h2>How to Import into Figma in Seconds:</h2>
        <p>1. Drag and drop any <code>.svg</code> file directly onto your Figma canvas.<br>
           2. Figma natively converts every vector path, text element, group, and gradient into fully editable Figma frames & layers.</p>
      </div>
      <a href="figma-canvas-all-templates.svg" download class="download-all-btn">DOWNLOAD MASTER FIGMA CANVAS SVG ↓</a>
    </div>

    <!-- Template 1 -->
    <div class="template-card" id="t1">
      <div class="card-meta">
        <div>
          <h3>01: Special Report / Vol. I Dispatch</h3>
          <p style="font-size: 13px; color: var(--muted); margin-top: 4px;">Vintage Broadsheet, Apollo 11 Lunar Landing, Cartographic Layouts, Technical Specs</p>
        </div>
        <div class="card-actions">
          <span class="dims">1440 × 2950 px</span>
          <a href="01-dispatch-special-report.svg" download>Download SVG</a>
          <a href="01-dispatch-special-report.svg" target="_blank">Open Fullscreen</a>
        </div>
      </div>
      <div class="svg-viewer">
        <img src="01-dispatch-special-report.svg" alt="Template 1 Broadsheet">
      </div>
    </div>

    <!-- Template 2 -->
    <div class="template-card" id="t2">
      <div class="card-meta">
        <div>
          <h3>02: The Archive Opens — Cinematic Hero Stage</h3>
          <p style="font-size: 13px; color: var(--muted); margin-top: 4px;">Cinematic opening hero, perspective newspaper centerpiece, and highlighted "Scroll space" scrub section</p>
        </div>
        <div class="card-actions">
          <span class="dims">1440 × 2850 px</span>
          <a href="02-the-archive-opens.svg" download>Download SVG</a>
          <a href="02-the-archive-opens.svg" target="_blank">Open Fullscreen</a>
        </div>
      </div>
      <div class="svg-viewer">
        <img src="02-the-archive-opens.svg" alt="Template 2 The Archive Opens">
      </div>
    </div>

    <!-- Template 3 -->
    <div class="template-card" id="t3">
      <div class="card-meta">
        <div>
          <h3>03: This Day in Technology — 10 September Timeline</h3>
          <p style="font-size: 13px; color: var(--muted); margin-top: 4px;">Interactive chronological technology timeline, category filters, and 2020 featured milestone</p>
        </div>
        <div class="card-actions">
          <span class="dims">1440 × 2950 px</span>
          <a href="03-this-day-in-tech-timeline.svg" download>Download SVG</a>
          <a href="03-this-day-in-tech-timeline.svg" target="_blank">Open Fullscreen</a>
        </div>
      </div>
      <div class="svg-viewer">
        <img src="03-this-day-in-tech-timeline.svg" alt="Template 3 Tech Timeline">
      </div>
    </div>

    <!-- Template 4 -->
    <div class="template-card" id="t4">
      <div class="card-meta">
        <div>
          <h3>04: One Day, One Year — Master Homepage</h3>
          <p style="font-size: 13px; color: var(--muted); margin-top: 4px;">Complete platform homepage with circular date dial, five moments cards, Apollo 1969 feature, and celestial orbits</p>
        </div>
        <div class="card-actions">
          <span class="dims">1440 × 3300 px</span>
          <a href="04-oneday-oneyear-homepage.svg" download>Download SVG</a>
          <a href="04-oneday-oneyear-homepage.svg" target="_blank">Open Fullscreen</a>
        </div>
      </div>
      <div class="svg-viewer">
        <img src="04-oneday-oneyear-homepage.svg" alt="Template 4 Homepage">
      </div>
    </div>

    <!-- Master Canvas -->
    <div class="template-card" id="canvas">
      <div class="card-meta">
        <div>
          <h3>Master All-in-One Multi-Artboard Figma Canvas</h3>
          <p style="font-size: 13px; color: var(--muted); margin-top: 4px;">All 4 design templates laid out side-by-side with Artboard labels in a single 6500×3700 px canvas</p>
        </div>
        <div class="card-actions">
          <span class="dims">6500 × 3700 px</span>
          <a href="figma-canvas-all-templates.svg" download>Download Master Canvas SVG</a>
          <a href="figma-canvas-all-templates.svg" target="_blank">Open Fullscreen</a>
        </div>
      </div>
      <div class="svg-viewer">
        <img src="figma-canvas-all-templates.svg" alt="Master All-in-One Canvas">
      </div>
    </div>
  </div>

  <footer>
    <p>One Day, One Year • Figma Design System &amp; Templates Repository • © 2026</p>
  </footer>
</body>
</html>'''

# Main execution loop to write all files
t1 = generate_t1()
t2 = generate_t2()
t3 = generate_t3()
t4 = generate_t4(mission_control_uri)
master_canvas = generate_master_canvas(t1, t2, t3, t4)
comp_datepicker = generate_comp_datepicker()
comp_celestial = generate_comp_celestial()
html_viewer = generate_html_viewer()

files_to_write = [
    (os.path.join(OUTPUT_DIR, "01-dispatch-special-report.svg"), t1),
    (os.path.join(OUTPUT_DIR, "02-the-archive-opens.svg"), t2),
    (os.path.join(OUTPUT_DIR, "03-this-day-in-tech-timeline.svg"), t3),
    (os.path.join(OUTPUT_DIR, "04-oneday-oneyear-homepage.svg"), t4),
    (os.path.join(OUTPUT_DIR, "figma-canvas-all-templates.svg"), master_canvas),
    (os.path.join(COMPONENTS_DIR, "component-date-picker-widget.svg"), comp_datepicker),
    (os.path.join(COMPONENTS_DIR, "component-celestial-orbit-map.svg"), comp_celestial),
    (os.path.join(OUTPUT_DIR, "index.html"), html_viewer),

    # Also mirror into public/figma-design-templates/
    (os.path.join(PUBLIC_DIR, "01-dispatch-special-report.svg"), t1),
    (os.path.join(PUBLIC_DIR, "02-the-archive-opens.svg"), t2),
    (os.path.join(PUBLIC_DIR, "03-this-day-in-tech-timeline.svg"), t3),
    (os.path.join(PUBLIC_DIR, "04-oneday-oneyear-homepage.svg"), t4),
    (os.path.join(PUBLIC_DIR, "figma-canvas-all-templates.svg"), master_canvas),
    (os.path.join(PUBLIC_COMPONENTS_DIR, "component-date-picker-widget.svg"), comp_datepicker),
    (os.path.join(PUBLIC_COMPONENTS_DIR, "component-celestial-orbit-map.svg"), comp_celestial),
    (os.path.join(PUBLIC_DIR, "index.html"), html_viewer),
]

for path, content in files_to_write:
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Wrote {os.path.basename(path)} ({len(content)} chars)")

print("All Figma design template SVGs generated successfully!")
