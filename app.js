/* ─────────────────────────────────────────────
   설정 — 이 파일(app.js)은 고치지 않습니다.
   배포판의 시트 주소는 config.js 한 줄(window.CAFE_CFG = "…")에 비밀번호로
   암호화되어 들어갑니다. config.js는 대시보드 주소 뒤에 #setup 을 붙여 여는
   초기 설정 화면에서 만든 내용으로 GitHub에서 직접 만듭니다(배포 묶음에는 없음).
───────────────────────────────────────────── */
const CFG_ENC = (() => { try { return String(window.CAFE_CFG || '').trim(); } catch (e) { return ''; } })();
const CFG = {"pw": "", "autoRefreshMin": 5, "hqSheetId": "", "storeSheetId": "", "hqGids": {}, "storeGids": {}};
const SPEC = [{"tab": "01_일매출", "key": "sales", "file": "store", "who": "각 지점 점장·부점장", "freq": "매일 마감", "how": "수기 (POS 마감 정산 전기)", "desc": "한 행 = 지점 × 하루. 합계·총매출은 넣지 않음(대시보드가 계산). 월별 탭 복사 금지 — 아래로 계속 추가", "cols": [["날짜", "d", "d", "YYYY-MM-DD (실제 날짜만)"], ["지점", "s", "s", "드롭다운"], ["영업상태", "st", "s", "정상 / 휴무 / 단축 / 행사 (비우면 정상)"], ["음료", "bev", "n", "매장 음료 매출 (할인 전, VAT 포함)"], ["베이커리", "bak", "n", "매장 베이커리 매출"], ["원두", "bean", "n", "매장 원두 판매"], ["도서", "book", "n", "매장 도서 판매"], ["기타", "etc", "n", "굿즈 등"], ["럭키밀", "lucky", "n", "판매일 기준 (정산일에 몰아넣지 않음)"], ["에이블리", "ably", "n", "홍대 '에이블리'·망원 '에이블리정산금' 통합"], ["배민_음료", "bm_bev", "n", "배민 정산의 음료분"], ["배민_베이커리", "bm_bak", "n", ""], ["배민_원두", "bm_bean", "n", ""], ["쿠팡_음료", "cp_bev", "n", "쿠팡이츠"], ["쿠팡_베이커리", "cp_bak", "n", ""], ["쿠팡_원두", "cp_bean", "n", ""], ["요기요_음료", "yg_bev", "n", "안 쓰면 비움"], ["요기요_베이커리", "yg_bak", "n", ""], ["포인트", "pt", "n", "음수(차감)로 입력"], ["협찬할인", "disc", "n", "음수(차감)로 입력. 포인트와 섞지 않음"], ["현금", "cash", "n", "결제수단 참고용 — 매출에 더하지 않음"], ["계좌이체", "xfer", "n", "결제수단 참고용"], ["객수", "cust", "n", "POS 영수 건수 (신설)"], ["메모", "memo", "s", "이슈·본사 전달사항 한 줄. 이름·연락처·근태 금지"]]}, {"tab": "02_베이커리판매폐기", "key": "bk_store", "file": "store", "who": "각 지점", "freq": "매일 마감", "how": "수기", "desc": "한 행 = 일자 × 지점 × 제품. 입고는 07_베이커리출고와 같아야 함. 수량만 (금액은 대시보드가 계산)", "cols": [["일자", "d", "d", ""], ["지점", "s", "s", ""], ["제품코드", "code", "s", "09_제품목록 코드"], ["입고", "recv", "n", "당일 입고(또는 매장 제조) 수량"], ["판매", "sold", "n", ""], ["폐기", "waste", "n", "수량만 (시각은 비고에)"], ["비고", "memo", "s", ""]]}, {"tab": "03_리뷰", "key": "reviews", "file": "store", "who": "각 지점", "freq": "매일(또는 주 1회)", "how": "수기", "desc": "한 행 = 일자 × 지점 × 플랫폼. 0도 입력(빈칸은 '집계 안 함')", "cols": [["일자", "d", "d", ""], ["지점", "s", "s", ""], ["플랫폼", "pf", "s", "네이버 / 카카오 / 구글 / 배민 / 쿠팡이츠 / 요기요"], ["전체", "total", "n", ""], ["긍정", "pos", "n", "기준: 별점 5"], ["부정", "neg", "n", "기준: 별점 3 이하"]]}, {"tab": "04_프로모션", "key": "promo", "file": "store", "who": "각 지점", "freq": "매일", "how": "수기", "desc": "한 행 = 일자 × 지점 × 프로모션. 리뷰 쿠키·파이브스팟·당무해 등 하루 사용 건수", "cols": [["일자", "d", "d", ""], ["지점", "s", "s", ""], ["프로모션", "item", "s", "네이버 리뷰 쿠키 / 파이브스팟 / 당무해 / 크루쉽 …"], ["수량", "qty", "n", "사용 건수"], ["메모", "memo", "s", ""]]}, {"tab": "05_법인카드", "key": "card", "file": "store", "who": "각 지점·생산시설", "freq": "사용 당일", "how": "수기", "desc": "한 행 = 결제 1건. 카드번호·소지자 이름 금지", "cols": [["일자", "d", "d", ""], ["지점", "s", "s", ""], ["가맹점", "merchant", "s", ""], ["계정", "cat", "s", "식자재·원재료 / 소모품 / 비품·장비 / 수리·유지 / 마케팅 / 공과금·수수료 / 복리후생 / 기타"], ["금액", "amt", "n", "승인금액"], ["용도", "memo", "s", ""]]}, {"tab": "06_재고수불", "key": "inv", "file": "store", "who": "각 지점 · 연남 베이커리", "freq": "월 1회 (익월 3일까지)", "how": "수기", "desc": "한 행 = 월 × 지점 × 품목. 기초는 전월 기말을 그대로(재입력 금지), 사용 = 기초+입고+이관입고−이관출고−기말. 원두(합정 로스터리에서 받는 것)는 수량만 — 단가·금액은 비워 두면 대시보드가 본사 단가로 계산", "cols": [["월", "m", "m", ""], ["지점", "s", "s", ""], ["분류", "cat", "s", ""], ["품목", "item", "s", ""], ["단위", "unit", "s", ""], ["거래처", "vendor", "s", ""], ["기초수량", "oq", "n", ""], ["입고수량", "iq", "n", ""], ["이관입고", "tiq", "n", ""], ["이관출고", "toq", "n", ""], ["기말수량", "cq", "n", "월말 실사"], ["사용수량", "uq", "n", ""], ["단가", "price", "n", "구매 단가. 원두 행은 비워 둠(본사 단가로 계산)"], ["기초금액", "oa", "n", "수량 × 단가. 원두 행은 비워 둠"], ["입고금액", "ia", "n", "원두 행은 비워 둠"], ["사용금액", "ua", "n", "원두 행은 비워 둠"], ["기말금액", "ca", "n", "원두 행은 비워 둠"]]}, {"tab": "07_베이커리출고", "key": "bk_ship", "file": "store", "who": "연남 베이커리", "freq": "매일", "how": "수기", "desc": "한 행 = 일자 × 지점 × 제품. 수량만 (납품가는 본사 시트에만)", "cols": [["일자", "d", "d", ""], ["지점", "s", "s", ""], ["제품코드", "code", "s", "09_제품목록 코드"], ["수량", "qty", "n", ""], ["구분", "kind", "s", "판매용 / 샌드위치용 / 리뷰증정 / 시식 (비우면 판매용)"], ["비고", "memo", "s", ""]]}, {"tab": "08_원두발주", "key": "beans", "file": "store", "who": "합정 로스터리", "freq": "매주 월요일", "how": "수기", "desc": "한 행 = 발주주차 × 거래처 × 품목 × 규격. 수량만 — 단가·금액은 본사 시트 M_원두단가로 대시보드가 계산", "cols": [["발주주차", "w", "d", "그 주 월요일"], ["거래처", "cust", "s", "지점명 또는 외부 거래처"], ["거래처유형", "ctype", "s", "직영 / 신사 / DMC / 마곡 / B2B / 기타"], ["지점", "s", "s", "우리 지점이면 지점명"], ["품목", "prod", "s", "연남(밸런스) / 홍대(산미) / 합정(디카프) / 싱글 …"], ["규격", "unit", "s", "1kg / 200g"], ["수량", "qty", "n", "봉"], ["kg", "kg", "n", "수량 × 규격"], ["비고", "memo", "s", ""]]}, {"tab": "09_제품목록", "key": "plist", "file": "store", "who": "연남 베이커리", "freq": "신제품·단종 시", "how": "수기", "desc": "베이커리 제품코드 목록 (드롭다운용). 원가·납품가는 본사 시트 M_제품에만. 새 제품은 두 곳에 같은 코드로", "cols": [["제품코드", "code", "s", "BK-분류-번호"], ["제품명", "name", "s", ""], ["분류", "cat", "s", ""], ["상태", "status", "s", "판매중 / 단종 / 시즌"]]}, {"tab": "00_설정", "key": "setting", "file": "hq", "who": "운영관리파트", "freq": "변경 시", "how": "수기", "desc": "연 목표·기준 비율·경고 기준. 대시보드 전체 설정 (대시보드 비밀번호는 여기 두지 않음 — 초기 설정 화면에서 정함)", "cols": [["항목", "k", "s", "설정 이름 (바꾸지 않음)"], ["값", "v", "s", "설정 값"], ["설명", "d", "s", "메모"]]}, {"tab": "01_지점", "key": "stores", "file": "hq", "who": "운영관리파트", "freq": "개점·변경 시", "how": "수기", "desc": "지점 마스터. 모든 탭의 '지점' 값은 여기 이름과 같아야 함", "cols": [["지점", "s", "s", "표준 이름: 연남/홍대/망원/마곡/신사/DMC/합정 (+생산: 연남베이커리/합정로스터리)"], ["유형", "type", "s", "직영 / 별도사업자 / 위탁 / 생산 / 영업종료"], ["법인합산", "corp", "s", "Y면 ㈜필름 카페 실적(연 목표)에 포함. 신사·DMC는 N"], ["개점일", "open", "d", "YYYY-MM-DD"], ["종료일", "close", "d", "영업 종료 시에만"], ["면적(평)", "py", "n", "운영 면적"], ["월목표매출", "target", "n", "POS 총매출(VAT 포함) 기준 월 목표. 비우면 목표 표시 안 함"], ["비고", "memo", "s", ""]]}, {"tab": "02_매장손익", "key": "pnl_store", "file": "hq", "who": "운영관리파트(재무)", "freq": "매주 월요일", "how": "수기 → 단계적으로 자동", "desc": "한 행 = 지점 × 주차. 32행 주간 블록 대신. 원가·인건비·기타 합계와 영업이익은 대시보드가 계산", "cols": [["주차시작", "ws", "d", "월요일(월 경계에서 자름)"], ["주차종료", "we", "d", ""], ["귀속월", "m", "m", "YYYY-MM"], ["주차", "wk", "n", "그 달의 몇 번째 주 (1부터)"], ["지점", "s", "s", ""], ["영업일수", "days", "n", ""], ["매출", "rev", "n", "POS 총매출 ÷ 1.1 (VAT 제외)"], ["원가_음료SPC", "c_bev", "n", "SPC 발주액"], ["원가_원두", "c_bean", "n", "로스터리 납품액"], ["원가_베이커리", "c_bak", "n", "연남 베이커리 출고액"], ["인건비_정직원", "l_ft", "n", "주간 배분액 (지점 합계만, 개인별 금액 금지)"], ["인건비_PT", "l_pt", "n", ""], ["배민수수료", "f_bm", "n", ""], ["쿠팡수수료", "f_cp", "n", ""], ["카드수수료", "f_card", "n", ""], ["보험료", "ins", "n", "월 금액 ÷ 일수 × 영업일수"], ["국민연금", "pen", "n", ""], ["복리후생비", "wel", "n", ""], ["소모품비", "sup", "n", ""], ["전기수도가스", "util", "n", ""], ["임차료", "rent", "n", ""], ["메모", "memo", "s", ""]]}, {"tab": "03_생산손익", "key": "pnl_prod", "file": "hq", "who": "운영관리파트(재무)", "freq": "매주 월요일", "how": "수기", "desc": "한 행 = 생산시설 × 주차. 납품매출은 받는 곳별로 한 칸씩 — 소계 칸 없음", "cols": [["주차시작", "ws", "d", ""], ["주차종료", "we", "d", ""], ["귀속월", "m", "m", ""], ["주차", "wk", "n", ""], ["시설", "s", "s", "연남베이커리 / 합정로스터리"], ["영업일수", "days", "n", ""], ["직영납품", "r_dir", "n", "직영 매장 납품(내부 이전가)"], ["신사납품", "r_sinsa", "n", "신사(별도사업자) 납품"], ["마곡납품", "r_magok", "n", "2026-01~03 마곡 가맹형 시기만"], ["DMC납품", "r_dmc", "n", ""], ["온라인기타", "r_etc", "n", "온라인·본사·B2B"], ["재료_생두", "m_green", "n", ""], ["재료_베이커리", "m_bak", "n", ""], ["재료_두바이", "m_dubai", "n", "두쫀쿠 재료"], ["노무_정직원", "l_ft", "n", "파티셰 정직원(파트장 포함)"], ["노무_PT", "l_pt", "n", ""], ["노무_로스터", "l_roast", "n", ""], ["배송비", "o_ship", "n", ""], ["소모품비", "o_sup", "n", ""], ["전기수도가스", "o_util", "n", ""], ["임차료", "o_rent", "n", ""], ["메모", "memo", "s", ""]]}, {"tab": "04_본사정산", "key": "pnl_hq", "file": "hq", "who": "운영관리파트(재무)", "freq": "매주·월말", "how": "수기", "desc": "부가수익과 본사비용. 월말 정산 항목은 해당 월에 귀속(마지막 주에 몰아넣지 않음)", "cols": [["주차시작", "ws", "d", "주간 항목이면 주차, 월 항목이면 그 달 1일"], ["주차종료", "we", "d", ""], ["귀속월", "m", "m", ""], ["구분", "kind", "s", "부가수익 / 본사비용"], ["항목", "item", "s", "드롭다운"], ["지점", "s", "s", "지점에 붙는 항목만"], ["금액", "amt", "n", ""], ["메모", "memo", "s", ""]]}, {"tab": "05_비용원장", "key": "ledger", "file": "hq", "who": "운영관리파트", "freq": "발생·확정 시", "how": "수기", "desc": "콘텐츠사업본부 02_비용원장과 같은 틀. 월별 스냅샷 탭 대신 한 원장에 누적, 같은 행을 계획→지급으로 바꿈", "cols": [["구분", "type", "s", "계획 / 지급 / 취소"], ["확정", "conf", "s", "Y = 금액·시기 확정(약정)"], ["반복", "rep", "s", "Y = 매월 반복(정기)"], ["귀속팀", "team", "s", "카페사업팀 등"], ["지점", "s", "s", "지점 또는 공통"], ["귀속월", "m", "m", "비용이 속하는 달 (YYYY-MM)"], ["지급월", "pm", "m", "돈이 나가는 달"], ["대구분", "major", "s", "원재료 / 원두·생두 / 마케팅 / 인테리어·출점 / 비품·장비 / 수리·유지 / 소모품 / 공과금·수수료 / 복리후생 / 기타"], ["소구분", "minor", "s", ""], ["금액", "amt", "n", "원"], ["지급방식", "pay", "s", "카드 / 계좌이체"], ["품의·증빙", "appr", "s", ""], ["상세", "detail", "s", ""], ["원천", "src", "s", "수기 / 카드 / SPC / 계좌"], ["비고", "memo", "s", ""]]}, {"tab": "06_T.O", "key": "to", "file": "hq", "who": "운영관리파트", "freq": "변동 시", "how": "수기", "desc": "한 행 = 자리(슬롯) 하나. 상태가 바뀌면 같은 행을 고침. 이름은 넣지 않음", "cols": [["기준일", "basis", "s", "마지막 수정일"], ["지점", "s", "s", "지점 / 연남베이커리 / 본사"], ["직급", "role", "s", "파트장 / 점장 / 부점장 / 매니저 / 파티셰 / PT평일 / PT주말"], ["근무시간", "hours", "s", "PT는 요일·시간"], ["상태", "status", "s", "재직 / 공석 / 채용중 / 오퍼진행 / 입사예정 / 퇴사예정"], ["메모", "memo", "s", ""]]}, {"tab": "07_근무집계", "key": "shifts", "file": "hq", "who": "운영관리파트", "freq": "월 1회", "how": "수기", "desc": "한 행 = 월 × 지점. 스케줄표의 합계를 옮김 (2단계에서 근무기록 롱포맷으로 대체)", "cols": [["월", "m", "m", ""], ["지점", "s", "s", ""], ["오픈", "open", "n", "매니저 오픈 근무 수"], ["마감", "close", "n", ""], ["미들", "mid", "n", ""], ["기타근무", "other", "n", ""], ["매니저인원", "mgr", "n", "그달 근무한 매니저 수"], ["지원받은근무", "sup_in", "n", "다른 지점 소속이 와서 한 근무"], ["PT인원", "pt", "n", ""], ["PT시간", "pth", "n", "배치 시간(휴게 미차감)"], ["시간외시간", "ot", "n", ""]]}, {"tab": "08_마케팅집행", "key": "mkt", "file": "hq", "who": "마케팅 담당", "freq": "집행 시", "how": "수기", "desc": "한 행 = 대행사·광고 집행 1건. 매출은 적지 않음(대시보드가 일매출과 연결). 지점 프로모션 사용은 지점 시트 04_프로모션", "cols": [["일자", "d", "d", ""], ["지점", "s", "s", ""], ["채널", "ch", "s", "대행사명 또는 광고 매체"], ["유형", "kind", "s", "인플루언서업로드 / 체험단방문 / 광고"], ["계정·항목", "item", "s", "인스타 계정 등"], ["팔로워", "fol", "n", ""], ["수량", "qty", "n", ""], ["비용", "cost", "n", ""], ["링크", "link", "s", ""], ["메모", "memo", "s", ""]]}, {"tab": "09_출점파이프라인", "key": "leads", "file": "hq", "who": "출점 담당", "freq": "수시", "how": "수기", "desc": "한 행 = 리드(건물·파트너) 하나. 단계가 바뀌면 같은 행을 고침. 이름·연락처는 Meta 리드 원본 시트에만", "cols": [["리드ID", "id", "s", ""], ["접수일", "d", "d", ""], ["접수월", "m", "m", ""], ["유형", "kind", "s", "입점 / 파트너 / 강남점투자 / 미팅희망"], ["시도", "sido", "s", ""], ["지역", "region", "s", ""], ["주소", "addr", "s", "건물 단위(호수 제외)"], ["층", "floor", "s", ""], ["면적(평)", "py", "n", ""], ["조건", "terms", "s", ""], ["경로", "src", "s", ""], ["단계", "stage", "s", "신규 / 연락중 / 상담완료 / 유망 / 미팅 / 협상 / 계약 / 오픈 / 드롭"], ["다음액션", "next", "s", ""], ["다음액션일", "nextd", "d", "활성 단계는 필수"], ["담당", "owner", "s", "팀·직책"], ["메모", "memo", "s", "신상 정보 금지"]]}, {"tab": "M_제품", "key": "products", "file": "hq", "who": "본사(베이커리)", "freq": "가격·원가 변경 시", "how": "수기", "desc": "베이커리 제품 마스터(원가·납품가·판매가). 가격이 바뀌면 덮어쓰지 말고 새 적용일 행 추가. 새 제품은 지점 시트 09_제품목록에도 같은 코드로", "cols": [["제품코드", "code", "s", "BK-분류-번호"], ["제품명", "name", "s", ""], ["분류", "cat", "s", ""], ["원가", "cost", "n", "직영원가(VAT 제외)"], ["납품가", "supply", "n", "신사·DMC 납품가"], ["판매가", "price", "n", "VAT 포함"], ["적용일", "from", "d", ""], ["상태", "status", "s", "판매중 / 단종 / 시즌"], ["비고", "memo", "s", ""]]}, {"tab": "M_메뉴원가", "key": "menu", "file": "hq", "who": "본사(음료)", "freq": "레시피·단가 변경 시", "how": "수기", "desc": "음료 메뉴 원가. 기준일별 탭 복사 대신 적용일 행 추가", "cols": [["적용일", "from", "d", ""], ["분류", "cat", "s", ""], ["메뉴", "menu", "s", ""], ["옵션", "opt", "s", "HOT / ICE"], ["판매가", "price", "n", ""], ["원가_매장", "cost", "n", ""], ["원가_포장", "cost_to", "n", "테이크아웃 용기 포함"], ["비고", "memo", "s", ""]]}, {"tab": "M_원두단가", "key": "bean_price", "file": "hq", "who": "운영관리파트 · 합정 로스터리", "freq": "단가 변경 시", "how": "수기", "desc": "거래처유형별 원두 단가 이력. 지점 시트 08_원두발주의 수량에 이 단가를 곱해 금액을 계산(적용일이 발주주차 이전인 것 중 가장 최근)", "cols": [["적용일", "from", "d", ""], ["거래처유형", "ctype", "s", "08_원두발주의 거래처유형과 같은 이름"], ["품목", "prod", "s", ""], ["규격", "unit", "s", ""], ["단가", "price", "n", ""], ["근거", "memo", "s", ""]]}, {"tab": "M_재고단가", "key": "inv_price", "file": "hq", "who": "운영관리파트", "freq": "단가 변경 시", "how": "수기", "desc": "지점 재고수불의 원두(합정 로스터리 이관분) 단가. 지점 시트에는 수량만 적고, 대시보드가 수량 × 이 단가로 재고·사용 금액을 계산(적용월이 그 달 이전인 것 중 가장 최근). 한 행 = 지점 × 품목 × 단가가 바뀐 달", "cols": [["적용월", "from", "m", "이 달부터 적용 (YYYY-MM)"], ["지점", "s", "s", ""], ["품목", "item", "s", "지점 시트 06_재고수불의 품목명과 똑같이"], ["단위", "unit", "s", ""], ["단가", "price", "n", ""], ["메모", "memo", "s", ""]]}, {"tab": "90_보관_2025손익", "key": "hist2025", "file": "hq", "who": "(보관)", "freq": "—", "how": "읽기 전용", "desc": "2025년 구양식 월 손익(지점별). 전년 비교용. 2025 연남 열에는 베이커리 생산이 섞여 있어 이익은 직접 비교 불가", "cols": [["월", "m", "m", ""], ["지점", "s", "s", ""], ["매출", "rev", "n", ""], ["원가", "cogs", "n", ""], ["인건비", "labor", "n", ""], ["기타", "other", "n", ""], ["임차료", "rent", "n", ""], ["영업이익", "op", "n", ""]]}];
const SNAPSHOT = null;
const MIGCHECKS = [];
const NETSHEET = {};
'use strict';
/* ═══════════════════════════════════════════════
   카페 공명 대시보드 — core (helpers · data · model · charts)
   ═══════════════════════════════════════════════ */

/* ── helpers ── */
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isNum = v => typeof v === 'number' && isFinite(v);
const nz = v => isNum(v) ? v : 0;
const sum = (arr, f) => arr.reduce((a, x) => a + nz(f ? f(x) : x), 0);
const uniq = a => [...new Set(a)];
const won = n => {
  if (!isNum(n)) return '–';
  const a = Math.abs(n), s = n < 0 ? '-' : '';
  if (a >= 1e8) return s + (a / 1e8).toFixed(a >= 1e9 ? 1 : 2).replace(/0$/, '').replace(/\.$/, '') + '억';
  if (a >= 1e4) return s + Math.round(a / 1e4).toLocaleString() + '만';
  return s + Math.round(a).toLocaleString() + '원';
};
const wonFull = n => isNum(n) ? Math.round(n).toLocaleString() + '원' : '–';
const man = n => isNum(n) ? Math.round(n / 1e4).toLocaleString() : '–';
const num = (n, d = 0) => isNum(n) ? n.toLocaleString(undefined, {maximumFractionDigits: d, minimumFractionDigits: 0}) : '–';
const ratio = (a, b) => (isNum(a) && isNum(b) && b !== 0) ? a / b : null;
const fp = (x, d = 1) => isNum(x) ? (x * 100).toFixed(d) + '%' : '–';
const fpp = (x, d = 1) => isNum(x) ? (x >= 0 ? '+' : '') + (x * 100).toFixed(d) + '%' : '–';
const sign = (n, f = won) => isNum(n) ? (n > 0 ? '+' : '') + f(n) : '–';
const deltaCls = (x, goodUp = true) => !isNum(x) || Math.abs(x) < 0.0005 ? '' : ((x > 0) === goodUp ? 'up' : 'dn');
const pad2 = n => String(n).padStart(2, '0');
const ymOf = d => (d || '').slice(0, 7);
const dim = ym => { const [y, m] = ym.split('-').map(Number); return new Date(y, m, 0).getDate(); };
const ymAdd = (ym, k) => { const [y, m] = ym.split('-').map(Number); const d = new Date(y, m - 1 + k, 1); return d.getFullYear() + '-' + pad2(d.getMonth() + 1); };
const mLab = (ym, withYear) => { if (!ym) return ''; const [y, m] = ym.split('-'); return withYear ? `${y}년 ${Number(m)}월` : Number(m) + '월'; };
/* 축 라벨: 해가 바뀌는 곳과 첫 칸에만 연도 */
const mAxis = list => list.map((ym, i) => { const [y, m] = ym.split('-'); return (i === 0 || m === '01') ? y.slice(2) + '.' + Number(m) : Number(m) + '월'; });
const dLab = d => { if (!d) return ''; const [, m, dd] = d.split('-'); return Number(m) + '/' + Number(dd); };
const DOW = ['일', '월', '화', '수', '목', '금', '토'];
const dowOf = d => { const [y, m, dd] = d.split('-').map(Number); return new Date(y, m - 1, dd).getDay(); };
const monthsBetween = (a, b) => { const out = []; let x = a; while (x <= b) { out.push(x); x = ymAdd(x, 1); } return out; };
const groupBy = (arr, f) => { const o = {}; for (const x of arr) { const k = f(x); (o[k] = o[k] || []).push(x); } return o; };
const lsGet = k => { try { return localStorage.getItem('cafe-dash:' + k); } catch (e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem('cafe-dash:' + k, v); } catch (e) {} };

/* 지점 목록 — 아래는 기본 순서·색. 새 지점은 본사 시트 01_지점에 한 줄 추가하면 syncSites()가 뒤에 붙인다(코드 수정 없음) */
const STORES = ['연남', '홍대', '망원', '마곡', '신사', 'DMC', '합정'];
const FACILITIES = ['연남베이커리', '합정로스터리'];
const BASE_SITES = new Set([...STORES, ...FACILITIES]);
const NEW_STORE_COLORS = ['#E34948'];   // 범주 팔레트 8번째 칸(검증 통과). 9번째 지점부터는 회색 — 색을 새로 만들지 않음
const NON_SITES = new Set(['본사', '공통', '직영', '기타', '전체']);
const SAFE_NAME = /^[\p{L}\p{N} ()._·&-]{1,20}$/u;
const SCOLOR = {'연남': '#3A5BD9', '홍대': '#EB6834', '망원': '#1BAF7A', '마곡': '#EDA100', '신사': '#E87BA4', 'DMC': '#008300', '합정': '#4A3AA7',
                '연남베이커리': '#3A5BD9', '합정로스터리': '#4A3AA7', '기타': '#96A1AE', '본사': '#96A1AE'};
const GRAY = '#96A1AE';
const sc = s => SCOLOR[s] || GRAY;
const sOrd = s => { const i = STORES.indexOf(s); return i < 0 ? 99 : i; };
const dot = s => `<i class="dot" style="background:${sc(s)}"></i>`;
function syncSites() {
  for (const r of (DB.stores || [])) {
    const s = String(r.s == null ? '' : r.s).trim();
    if (!s || NON_SITES.has(s) || !SAFE_NAME.test(s) || STORES.includes(s) || FACILITIES.includes(s)) continue;
    if (String(r.type || '').trim() === '생산') { FACILITIES.push(s); if (!SCOLOR[s]) SCOLOR[s] = GRAY; continue; }
    STORES.push(s);
    if (!SCOLOR[s]) SCOLOR[s] = NEW_STORE_COLORS[STORES.filter(x => !BASE_SITES.has(x)).length - 1] || GRAY;
  }
}

/* ── parsing ── */
function toNum(v) {
  if (v == null) return null;
  if (typeof v === 'number') return isFinite(v) ? v : null;
  let s = String(v).trim();
  if (!s || s === '-' || s === '–' || /^#/.test(s)) return null;
  let neg = false;
  if (/^\(.*\)$/.test(s)) { neg = true; s = s.slice(1, -1); }
  s = s.replace(/[,\s원₩]/g, '').replace(/[−–]/g, '-');
  if (/^--/.test(s)) s = '-' + s.replace(/^-+/, '');
  let pctv = false;
  if (/%$/.test(s)) { pctv = true; s = s.slice(0, -1); }
  const n = Number(s);
  if (!isFinite(n)) return null;
  return (neg ? -n : n) / (pctv ? 100 : 1);
}
function toDate(v) {
  if (v == null) return null;
  const s = String(v).trim();
  if (!s) return null;
  let m;
  if ((m = s.match(/^(\d{4})[-./년\s]+(\d{1,2})[-./월\s]+(\d{1,2})/))) return m[1] + '-' + pad2(m[2]) + '-' + pad2(m[3]);
  if ((m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/))) return m[3] + '-' + pad2(m[1]) + '-' + pad2(m[2]);
  return null;
}
function toMonth(v) {
  if (v == null) return null;
  const s = String(v).trim();
  if (!s) return null;
  let m;
  if ((m = s.match(/^(\d{4})[-./년\s]+(\d{1,2})/))) return m[1] + '-' + pad2(m[2]);
  if ((m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/))) return m[3] + '-' + pad2(m[1]);
  return null;
}
function parseCSV(text) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; }
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c !== '\r') cur += c;
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
  return rows;
}
const normH = s => String(s || '').replace(/\s+/g, '').replace(/[()（）]/g, '').toLowerCase();

/* ── data: snapshot 또는 구글 시트 ── */
let DB = {};           // key → [row objects]
let SOURCE = {mode: 'none', at: null, errors: []};
const SPEC_BY_KEY = {};
SPEC.forEach(t => SPEC_BY_KEY[t.key] = t);
const FILE_LABEL = {store: '지점 시트', hq: '본사 시트'};
const TN = k => (SPEC_BY_KEY[k] || {}).tab || k;                          // 탭 이름
const TNF = k => (FILE_LABEL[(SPEC_BY_KEY[k] || {}).file] || '') + ' ' + TN(k); // 시트 + 탭 이름

function decodeSnapshot(snap) {
  const out = {};
  for (const [key, t] of Object.entries(snap.t)) {
    const cols = t.c, dict = t.k || {};
    out[key] = t.r.map(r => {
      const o = {};
      for (let i = 0; i < cols.length; i++) {
        let v = r[i];
        if (dict[i] && v != null) v = dict[i][v];
        o[cols[i]] = v == null ? null : v;
      }
      return o;
    });
  }
  return out;
}
function rowsFromCSV(key, text) {
  const spec = SPEC_BY_KEY[key];
  const grid = parseCSV(text);
  if (!grid.length) { const e = []; e.hit = 0; e.ncol = spec.cols.length; return e; }
  // 헤더 행 찾기: 스펙 열 이름이 가장 많이 맞는 행 (앞 5행 안)
  let hi = 0, best = -1;
  for (let i = 0; i < Math.min(5, grid.length); i++) {
    const hs = grid[i].map(normH);
    const hit = spec.cols.filter(c => hs.includes(normH(c[0]))).length;
    if (hit > best) { best = hit; hi = i; }
  }
  const hs = grid[hi].map(normH);
  const map = spec.cols.map(c => [c[1], c[2], hs.indexOf(normH(c[0]))]);
  const out = [];
  out.hit = Math.max(best, 0); out.ncol = spec.cols.length;   // 열 이름 일치 수 — 엉뚱한 탭을 읽었는지 판단
  for (let r = hi + 1; r < grid.length; r++) {
    const g = grid[r];
    if (!g || g.every(x => !String(x).trim())) continue;
    const o = {};
    for (const [k, t, idx] of map) {
      const raw = idx >= 0 ? g[idx] : null;
      o[k] = t === 'n' ? toNum(raw) : t === 'd' ? toDate(raw) : t === 'm' ? toMonth(raw) : (raw == null ? null : (String(raw).trim() || null));
    }
    out.push(o);
  }
  return out;
}
/* 탭 → 어느 시트의 어느 탭인지. cfg를 넘기면 그 설정으로(초기 설정 화면의 연결 확인) */
function sheetOf(key, cfg) {
  cfg = cfg || CFG;
  const t = SPEC_BY_KEY[key] || {};
  return t.file === 'store'
    ? {id: cfg.storeSheetId, gid: (cfg.storeGids || {})[key], name: t.tab}
    : {id: cfg.hqSheetId, gid: (cfg.hqGids || {})[key], name: t.tab};
}
const hasGid = g => g != null && String(g).trim() !== '';
async function fetchCSV(url, retry = 1) {
  const res = await fetch(url, {cache: 'no-store'}).catch(() => null);
  if (res && res.status === 429 && retry > 0) { await new Promise(r => setTimeout(r, 1500)); return fetchCSV(url, retry - 1); }
  if (!res) return {err: '연결 실패(네트워크·공유 설정)'};
  if (!res.ok) return {err: 'HTTP ' + res.status + (res.status === 401 || res.status === 403 ? ' — 공유 설정 확인' : res.status === 400 || res.status === 404 ? ' — 탭을 찾지 못함' : '')};
  const text = await res.text();
  if (/^\s*<(!doctype|html)/i.test(text)) return {err: '공유되지 않음(로그인 화면이 옴)'};
  return {text};
}
/* gid가 있으면 export(표시값 그대로) → gviz 순서, 없으면 탭 이름으로 gviz.
   gviz는 숨긴·접은 행을 빼고 한 열에 형식이 섞이면 적은 쪽을 비우므로 gid를 권장 */
async function fetchTab(key, cfg) {
  const {id, gid, name} = sheetOf(key, cfg);
  if (!id) return null;
  const base = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(id)}`;
  const byGid = hasGid(gid);
  const urls = byGid
    ? [`${base}/export?format=csv&gid=${encodeURIComponent(String(gid).trim())}`, `${base}/gviz/tq?tqx=out:csv&gid=${encodeURIComponent(String(gid).trim())}`]
    : [`${base}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(name)}`];
  let last = '';
  for (const u of urls) {
    const r = await fetchCSV(u);
    if (r.text == null) { last = r.err; continue; }
    const rows = rowsFromCSV(key, r.text);
    if (rows.hit < Math.ceil(rows.ncol / 2)) { last = `열 이름이 ${rows.hit}/${rows.ncol}개만 맞음 — 다른 탭을 읽은 듯(${byGid ? 'gid 확인' : '탭 이름 확인'})`; continue; }
    rows.via = byGid ? 'gid' : 'name';
    return rows;
  }
  throw new Error(`${TNF(key)} — ${last}`);
}
/* 동시에 n개씩 — 구글이 한꺼번에 많은 요청을 막지 않도록 */
async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({length: Math.min(n, items.length)}, async () => { while (i < items.length) { const x = items[i++]; await fn(x); } }));
}
async function loadLive() {
  const keys = SPEC.map(t => t.key);
  const heavy = ['bk_ship', 'bk_store', 'inv'];
  const first = keys.filter(k => !heavy.includes(k));
  const errs = [], db = {};
  await pool(first, 6, async k => { db[k] = await fetchTab(k).catch(e => { errs.push(e.message); return null; }) || []; });
  heavy.forEach(k => db[k] = []);
  return {db, errs, heavy};
}

/* ── model ── */
let M = {};
const SALES_F = ['bev', 'bak', 'bean', 'book', 'etc', 'lucky', 'ably', 'bm_bev', 'bm_bak', 'bm_bean', 'cp_bev', 'cp_bak', 'cp_bean', 'yg_bev', 'yg_bak', 'pt', 'disc', 'cash', 'xfer', 'cust'];
const STORE_COST = ['c_bev', 'c_bean', 'c_bak', 'l_ft', 'l_pt', 'f_bm', 'f_cp', 'f_card', 'ins', 'pen', 'wel', 'sup', 'util', 'rent'];
const PROD_REV = ['r_dir', 'r_sinsa', 'r_magok', 'r_dmc', 'r_etc'];
const PROD_COST = ['m_green', 'm_bak', 'm_dubai', 'l_ft', 'l_pt', 'l_roast', 'o_ship', 'o_sup', 'o_util', 'o_rent'];

function salesDerive(r) {
  const g = k => nz(r[k]);
  r._hall = g('bev') + g('bak') + g('bean') + g('book') + g('etc') + g('lucky') + g('ably');
  r._bm = g('bm_bev') + g('bm_bak') + g('bm_bean');
  r._cp = g('cp_bev') + g('cp_bak') + g('cp_bean');
  r._yg = g('yg_bev') + g('yg_bak');
  r._dlv = r._bm + r._cp + r._yg;
  r._tot = r._hall + r._dlv;
  r._adj = g('pt') + g('disc');
  r._bevAll = g('bev') + g('bm_bev') + g('cp_bev') + g('yg_bev');
  r._bakAll = g('bak') + g('bm_bak') + g('cp_bak') + g('yg_bak');
  r._beanAll = g('bean') + g('bm_bean') + g('cp_bean');
  r._otherAll = g('book') + g('etc') + g('lucky') + g('ably');
}
function addTo(o, r, keys) { for (const k of keys) o[k] = (o[k] || 0) + nz(r[k]); }
function parseRange(s, dflt) {
  const m = String(s || '').match(/([\d.]+)\s*~\s*([\d.]+)/);
  return m ? [Number(m[1]), Number(m[2])] : dflt;
}

function buildModel() {
  const set = {};
  (DB.setting || []).forEach(r => { if (r.k) set[String(r.k).trim()] = r.v; });
  M = {set};
  M.pw = String(CFG.pw || '').trim();   // 스냅샷판 화면 잠금용. 배포판은 CFG_ENC 복호화가 잠금
  M.target = toNum(set['연목표매출']) || 0;
  M.year = String(set['기준연도'] || '2026');
  M.rng = {
    cogs: parseRange(set['기준_원가율'], [.30, .35]), labor: parseRange(set['기준_인건비율'], [.15, .20]),
    other: parseRange(set['기준_기타비율'], [0, .20]), rent: parseRange(set['기준_임차료율'], [.10, .15]),
    op: parseRange(set['기준_영업이익률'], [.10, .25]), pmat: parseRange(set['기준_제조재료비율'], [.45, .50]),
    plab: parseRange(set['기준_제조노무비율'], [.15, .20]), poh: parseRange(set['기준_제조경비율'], [.10, .15]),
    pmar: parseRange(set['기준_제조마진율'], [.15, .25]),
  };
  M.wasteWarn = toNum(set['경고_폐기율']) || 0.20;
  M.asOf = toDate(set['데이터기준일']);
  M.storeMeta = {};
  (DB.stores || []).forEach(r => { if (r.s) M.storeMeta[String(r.s).trim()] = r; });
  syncSites();
  /* 01_지점에 없는 지점 이름(오타·미등록) — 이런 행은 화면에서 빠지므로 알려 줌 */
  M.unknownSites = {};
  const known = new Set([...STORES, ...FACILITIES, ...NON_SITES]);
  for (const k of ['sales', 'bk_store', 'reviews', 'promo', 'card', 'inv', 'bk_ship', 'pnl_store', 'pnl_prod', 'shifts']) {
    for (const r of (DB[k] || [])) { const s = r.s; if (s && !known.has(s)) { const o = (M.unknownSites[s] = M.unknownSites[s] || {n: 0, tabs: new Set()}); o.n++; o.tabs.add(k); } }
  }
  M.corp = s => (M.storeMeta[s] ? String(M.storeMeta[s].corp || '').toUpperCase() !== 'N' : !['신사', 'DMC'].includes(s));

  /* 매출 */
  const S = {sm: {}, sd: {}, last: {}, rows: DB.sales || []};
  for (const r of S.rows) {
    if (!r.d || !r.s) continue;
    salesDerive(r);
    const m = ymOf(r.d);
    const o = ((S.sm[r.s] = S.sm[r.s] || {})[m] = S.sm[r.s][m] || {days: 0, last: null});
    addTo(o, r, SALES_F.concat(['_hall', '_bm', '_cp', '_yg', '_dlv', '_tot', '_adj', '_bevAll', '_bakAll', '_beanAll', '_otherAll']));
    if (r._tot > 0) { o.days++; if (!o.last || r.d > o.last) o.last = r.d; if (!S.last[r.s] || r.d > S.last[r.s]) S.last[r.s] = r.d; }
    (S.sd[r.s] = S.sd[r.s] || {})[r.d] = r;
  }
  M.S = S;

  /* 매장 손익 */
  const P = {sm: {}, weeks: {}, rows: DB.pnl_store || []};
  for (const r of P.rows) {
    if (!r.m || !r.s) continue;
    r._cogs = nz(r.c_bev) + nz(r.c_bean) + nz(r.c_bak);
    r._labor = nz(r.l_ft) + nz(r.l_pt);
    r._other = nz(r.f_bm) + nz(r.f_cp) + nz(r.f_card) + nz(r.ins) + nz(r.pen) + nz(r.wel) + nz(r.sup) + nz(r.util);
    r._cost = r._cogs + r._labor + r._other + nz(r.rent);
    r._op = nz(r.rev) - r._cost;
    const o = ((P.sm[r.s] = P.sm[r.s] || {})[r.m] = P.sm[r.s][r.m] || {wk: [], lastEnd: null});
    addTo(o, r, ['rev', 'days'].concat(STORE_COST, ['_cogs', '_labor', '_other', '_cost', '_op']));
    o.wk.push(r.wk); if (!o.lastEnd || r.we > o.lastEnd) o.lastEnd = r.we;
    const wkey = r.ws;
    (P.weeks[wkey] = P.weeks[wkey] || {ws: r.ws, we: r.we, m: r.m, wk: r.wk});
  }
  M.P = P;

  /* 생산 손익 */
  const PR = {sm: {}, rows: DB.pnl_prod || []};
  for (const r of PR.rows) {
    if (!r.m || !r.s) continue;
    r._rev = sum(PROD_REV, k => r[k]);
    r._ext = nz(r.r_sinsa) + nz(r.r_magok) + nz(r.r_dmc) + nz(r.r_etc);
    r._mat = nz(r.m_green) + nz(r.m_bak) + nz(r.m_dubai);
    r._lab = nz(r.l_ft) + nz(r.l_pt) + nz(r.l_roast);
    r._oh = nz(r.o_ship) + nz(r.o_sup) + nz(r.o_util) + nz(r.o_rent);
    r._cost = r._mat + r._lab + r._oh;
    r._mar = r._rev - r._cost;
    const o = ((PR.sm[r.s] = PR.sm[r.s] || {})[r.m] = PR.sm[r.s][r.m] || {});
    addTo(o, r, PROD_REV.concat(PROD_COST, ['_rev', '_ext', '_mat', '_lab', '_oh', '_cost', '_mar']));
  }
  M.PR = PR;

  /* 본사 정산 */
  const H = {m: {}, rows: DB.pnl_hq || []};
  for (const r of H.rows) {
    if (!r.m || !isNum(r.amt)) continue;
    const o = (H.m[r.m] = H.m[r.m] || {inc: 0, cost: 0, items: {}});
    const isInc = String(r.kind || '').includes('수익');
    o[isInc ? 'inc' : 'cost'] += r.amt;
    const label = (r.item || '기타') + (r.s && !['', '직영'].includes(r.s) && !String(r.item || '').includes(r.s) ? ' · ' + r.s : (r.s === '직영' ? ' · 직영' : ''));
    const k = (isInc ? '+' : '-') + label;
    o.items[k] = (o.items[k] || 0) + r.amt;
  }
  M.H = H;

  /* 월 합계: 법인 매출 · 순이익 */
  const allM = uniq([].concat(
    ...Object.values(P.sm).map(o => Object.keys(o)),
    ...Object.values(PR.sm).map(o => Object.keys(o)),
    Object.keys(H.m))).sort();
  M.F = {};
  for (const m of allM) {
    let storeRev = 0, storeOp = 0, stores = [];
    for (const s in P.sm) { const o = P.sm[s][m]; if (!o) continue; if (M.corp(s)) { storeRev += nz(o.rev); } storeOp += nz(o._op); stores.push(s); }
    let prodMar = 0, prodExt = 0, prodDir = 0;
    for (const f in PR.sm) { const o = PR.sm[f][m]; if (!o) continue; prodMar += nz(o._mar); prodExt += nz(o._ext); prodDir += nz(o.r_dir); }
    const h = H.m[m] || {inc: 0, cost: 0};
    M.F[m] = {storeRev, storeOp, prodMar, prodExt, prodDir, inc: h.inc, hqCost: h.cost,
              net: storeOp + prodMar + h.inc - h.cost, corpRev: storeRev + prodExt + h.inc, stores};
  }
  M.pnlMonths = allM;
  M.pnlLastEnd = uniq(P.rows.map(r => r.we)).sort().pop() || null;

  /* 2025 보관 */
  M.H25 = {};
  (DB.hist2025 || []).forEach(r => { if (r.m && r.s) (M.H25[r.s] = M.H25[r.s] || {})[r.m] = r; });

  buildBakery();

  /* 원두 — 지점 시트에는 수량만. 금액 = 수량 × 본사 M_원두단가(적용일 ≤ 발주주차 중 가장 최근) */
  const BP = {};
  (DB.bean_price || []).forEach(p => { if (p.ctype && p.prod && p.unit && isNum(p.price)) (BP[p.ctype + '|' + p.prod + '|' + p.unit] = BP[p.ctype + '|' + p.prod + '|' + p.unit] || []).push(p); });
  Object.values(BP).forEach(a => a.sort((x, y) => (x.from || '') < (y.from || '') ? -1 : 1));
  const priceOf = (r) => { const a = BP[r.ctype + '|' + r.prod + '|' + r.unit]; if (!a || !r.w) return null; let p = null; for (const x of a) { if (!x.from || x.from <= r.w) p = x.price; } return p; };
  const B = {m: {}, rows: DB.beans || [], custs: new Set()};
  for (const r of B.rows) {
    const m = ymOf(r.w); if (!m) continue;
    const c = r.cust || '기타';
    B.custs.add(c);
    const pr = priceOf(r);
    r._amt = isNum(pr) && isNum(r.qty) ? pr * r.qty : null;
    const o = ((B.m[m] = B.m[m] || {})[c] = B.m[m][c] || {kg: 0, amt: 0, qty: 0, noPrice: 0, ctype: r.ctype});
    o.kg += nz(r.kg); o.qty += nz(r.qty);
    if (isNum(r._amt)) o.amt += r._amt; else o.noPrice++;
  }
  M.B = B;

  /* 재고 — 원두(합정 로스터리 이관분)는 지점 시트에 수량만. 금액 = 수량 × 본사 M_재고단가(적용월 ≤ 그 달 중 가장 최근) */
  const XP = {};
  (DB.inv_price || []).forEach(p => { if (p.s && p.item && isNum(p.price)) (XP[p.s + '|' + p.item] = XP[p.s + '|' + p.item] || []).push(p); });
  Object.values(XP).forEach(a => a.sort((x, y) => (x.from || '') < (y.from || '') ? -1 : 1));
  const invPriceOf = r => { const a = XP[r.s + '|' + r.item]; if (!a) return null; let p = null; for (const x of a) { if (!x.from || x.from <= r.m) p = x.price; } return p; };
  const I = {sm: {}, rows: DB.inv || [], noPrice: 0, hqPriced: 0};
  for (const r of I.rows) {
    if (!r.m || !r.s) continue;
    if (!isNum(r.price) && ![r.oa, r.ia, r.ua, r.ca].some(isNum) || r._hqp) {
      const p = invPriceOf(r);
      if (isNum(p)) { r._hqp = true; r.oa = nz(r.oq) * p; r.ia = nz(r.iq) * p; r.ua = nz(r.uq) * p; r.ca = nz(r.cq) * p; I.hqPriced++; }
      else if (r.cat === '원두' && [r.oq, r.iq, r.uq, r.cq].some(v => nz(v))) I.noPrice++;
    }
    const o = ((I.sm[r.s] = I.sm[r.s] || {})[r.m] = I.sm[r.s][r.m] || {oa: 0, ia: 0, ua: 0, ca: 0, n: 0, cat: {}, items: []});
    o.oa += nz(r.oa); o.ia += nz(r.ia); o.ua += nz(r.ua); o.ca += nz(r.ca); o.n++;
    const c = r.cat || '기타';
    const co = (o.cat[c] = o.cat[c] || {ua: 0, ca: 0});
    co.ua += nz(r.ua); co.ca += nz(r.ca);
    o.items.push(r);
  }
  M.I = I;

  /* 법인카드 */
  const C = {sm: {}, last: {}, rows: DB.card || []};
  for (const r of C.rows) {
    if (!r.d || !r.s) continue;
    const m = ymOf(r.d);
    const o = ((C.sm[r.s] = C.sm[r.s] || {})[m] = C.sm[r.s][m] || {amt: 0, n: 0, cat: {}});
    o.amt += nz(r.amt); o.n++;
    const c = r.cat || '기타'; o.cat[c] = (o.cat[c] || 0) + nz(r.amt);
    if (!C.last[r.s] || r.d > C.last[r.s]) C.last[r.s] = r.d;
  }
  M.C = C;

  /* 인력 */
  M.TO = DB.to || [];
  M.SH = {};
  (DB.shifts || []).forEach(r => { if (r.m && r.s) (M.SH[r.m] = M.SH[r.m] || {})[r.s] = r; });

  /* 리뷰 */
  const R = {sm: {}, last: {}, rows: DB.reviews || []};
  for (const r of R.rows) {
    if (!r.d || !r.s) continue;
    const m = ymOf(r.d);
    const o = ((R.sm[r.s] = R.sm[r.s] || {})[m] = R.sm[r.s][m] || {total: 0, pos: 0, neg: 0, pf: {}, days: new Set()});
    o.total += nz(r.total); o.pos += nz(r.pos); o.neg += nz(r.neg); o.days.add(r.d);
    o.pf[r.pf || '기타'] = (o.pf[r.pf || '기타'] || 0) + nz(r.total);
    if (isNum(r.total) && (!R.last[r.s] || r.d > R.last[r.s])) R.last[r.s] = r.d;
  }
  M.R = R;
  M.MK = DB.mkt || [];
  M.PROMO = DB.promo || [];
  M.L = DB.leads || [];
  M.ledger = DB.ledger || [];
  M.menu = DB.menu || [];
  M.beanPrice = DB.bean_price || [];

  /* 기준월 목록 */
  const sm = uniq([].concat(...Object.values(S.sm).map(o => Object.keys(o)), allM)).filter(x => x >= M.year + '-01').sort();
  M.months = sm.length ? sm : [new Date().getFullYear() + '-' + pad2(new Date().getMonth() + 1)];
  M.lastSalesDate = Object.values(S.last).sort().pop() || M.asOf;
}

function buildBakery() {
  const prod = {};
  (DB.products || []).forEach(p => { if (p.code) prod[p.code] = p; });
  // 지점 시트 제품목록에만 있는 새 제품(본사 M_제품 등록 전)도 이름은 보이게
  (DB.plist || []).forEach(p => { if (p.code && !prod[p.code]) prod[p.code] = {code: p.code, name: p.name, cat: p.cat, status: p.status, _noMaster: true}; });
  const K = {prod, ship: {}, st: {}, pm: {}, rowsShip: DB.bk_ship || [], rowsStore: DB.bk_store || []};
  for (const r of K.rowsShip) {
    if (!r.d || !r.s) continue;
    const m = ymOf(r.d), p = prod[r.code] || {};
    const o = ((K.ship[m] = K.ship[m] || {})[r.s] = K.ship[m][r.s] || {qty: 0, amt: 0, cost: 0, days: new Set()});
    o.qty += nz(r.qty); o.amt += nz(r.qty) * nz(p.supply); o.cost += nz(r.qty) * nz(p.cost); o.days.add(r.d);
    const q = ((K.pm[m] = K.pm[m] || {})[r.code] = K.pm[m][r.code] || {ship: 0, recv: 0, sold: 0, waste: 0, stores: new Set()});
    q.ship += nz(r.qty); q.stores.add(r.s);
  }
  for (const r of K.rowsStore) {
    if (!r.d || !r.s) continue;
    const m = ymOf(r.d), p = prod[r.code] || {};
    const promo = String(r.code || '') === 'BK-SEA-01';   // 리뷰 쿠키(증정) — 폐기율 계산에서 뺌
    const o = ((K.st[m] = K.st[m] || {})[r.s] = K.st[m][r.s] || {recv: 0, sold: 0, waste: 0, wcost: 0, sales: 0, days: new Set()});
    if (!promo) {
      o.recv += nz(r.recv); o.waste += nz(r.waste); o.wcost += nz(r.waste) * nz(p.cost);
      if (!String(r.code || '').startsWith('BK-SDB')) { o.sold += nz(r.sold); o.sales += nz(r.sold) * nz(p.price); }
    }
    o.days.add(r.d);
    const q = ((K.pm[m] = K.pm[m] || {})[r.code] = K.pm[m][r.code] || {ship: 0, recv: 0, sold: 0, waste: 0, stores: new Set()});
    q.recv += nz(r.recv); q.sold += nz(r.sold); q.waste += nz(r.waste);
  }
  M.K = K;
}


/* ═══════════ charts (SVG, 컨테이너 폭에 맞춰 그림) ═══════════ */
const TIP = () => $('#tip');
function showTip(html, ev) {
  const t = TIP(); t.innerHTML = html; t.classList.add('on');
  moveTip(ev);
}
function moveTip(ev) {
  const t = TIP(); if (!t.classList.contains('on')) return;
  const x = ev.clientX, y = ev.clientY, w = t.offsetWidth, h = t.offsetHeight;
  let lx = x + 14, ly = y + 14;
  if (lx + w > window.innerWidth - 8) lx = x - w - 14;
  if (ly + h > window.innerHeight - 8) ly = y - h - 14;
  t.style.left = Math.max(8, lx) + 'px'; t.style.top = Math.max(8, ly) + 'px';
}
function hideTip() { TIP().classList.remove('on'); }
function tipRows(title, rows, foot) {
  return `<div class="tt">${esc(title)}</div>` + rows.map(r =>
    `<div class="row"><span>${r.c ? `<i style="background:${r.c}"></i>` : ''}${esc(r.n)}</span><b>${esc(r.v)}</b></div>`).join('') +
    (foot ? `<div class="row" style="margin-top:3px;border-top:1px solid rgba(255,255,255,.15);padding-top:3px"><span>${esc(foot.n)}</span><b>${esc(foot.v)}</b></div>` : '');
}
function niceStep(range, ticks = 4) {
  if (!(range > 0)) return 1;
  const raw = range / ticks, mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / mag;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * mag;
}
function axisFmt(v, unit) {
  if (unit === 'pct') return Math.round(v * 100) + '%';
  if (unit === 'n') return Math.abs(v) >= 10000 ? (v / 10000).toFixed(v % 10000 ? 1 : 0) + '만' : Math.round(v * 10) / 10 + '';
  const a = Math.abs(v);
  if (a >= 1e8) return (v / 1e8).toFixed(a % 1e8 ? 1 : 0) + '억';
  if (a >= 1e4) return Math.round(v / 1e4).toLocaleString() + '만';
  return String(Math.round(v));
}
let CHART_SEQ = 0;
const CHARTS = {};
function roundTopRect(x, y, w, h, r, down) {
  if (!(h > 0)) return '';
  r = Math.min(r, h, w / 2);
  if (down) return `M${x},${y} h${w} v${h - r} q0,${r} -${r},${r} h-${w - 2 * r} q-${r},0 -${r},-${r} Z`;
  return `M${x},${y + h} v-${h - r} q0,-${r} ${r},-${r} h${w - 2 * r} q${r},0 ${r},${r} v${h - r} Z`;
}
function placeholder(kind, o, legendHTML) {
  const id = 'ch' + (++CHART_SEQ);
  CHARTS[id] = {kind, o};
  return `<div class="chart" id="${id}" data-kind="${kind}" style="min-height:${o.h || 220}px"></div>${legendHTML || ''}`;
}
/* 세로 막대 (누적 가능) */
function colChart(o) {
  const S = o.series.filter(s => s.values.some(v => isNum(v) && v !== 0));
  if (!S.length) return `<div class="empty">표시할 데이터가 없습니다</div>`;
  const legend = (o.legend !== false && S.length > 1) ? `<div class="legend">${S.map(s => `<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join('')}</div>` : '';
  return placeholder('col', {...o, S}, legend);
}
function buildCol(C, W) {
  const o = C.o, S = o.S;
  const H = o.h || 220, ml = 44, mr = isNum(o.ref) ? 8 : 8, mt = 14, mb = 24;
  const pw = W - ml - mr, ph = H - mt - mb, n = o.cats.length;
  const stacked = o.stacked !== false;
  let max = 0, min = 0;
  for (let i = 0; i < n; i++) {
    if (stacked) {
      let p = 0, q = 0;
      S.forEach(s => { const v = nz(s.values[i]); if (v >= 0) p += v; else q += v; });
      max = Math.max(max, p); min = Math.min(min, q);
    } else S.forEach(s => { const v = nz(s.values[i]); max = Math.max(max, v); min = Math.min(min, v); });
  }
  if (isNum(o.ref)) max = Math.max(max, o.ref);
  const step = niceStep(max - min, 4);
  const top = Math.ceil(max / step) * step || step, bot = Math.floor(min / step) * step;
  const y = v => mt + ph * (top - v) / ((top - bot) || 1);
  let g = '';
  for (let v = bot; v <= top + step * 1e-6; v += step) {
    g += `<line x1="${ml}" x2="${W - mr}" y1="${y(v)}" y2="${y(v)}" stroke="${Math.abs(v) < step * 1e-6 ? 'var(--axis)' : 'var(--grid)'}" stroke-width="1"/>`;
    g += `<text x="${ml - 6}" y="${y(v) + 4}" text-anchor="end">${axisFmt(v, o.unit)}</text>`;
  }
  let refSvg = '';
  if (isNum(o.ref)) refSvg = `<line x1="${ml}" x2="${W - mr}" y1="${y(o.ref)}" y2="${y(o.ref)}" stroke="var(--accent-deep)" stroke-width="1.5"/><text x="${W - mr}" y="${y(o.ref) - 5}" text-anchor="end" style="fill:var(--accent-deep);font-weight:700">${esc(o.refLabel || '목표 속도')}</text>`;
  const band = pw / n;
  const k = stacked ? 1 : S.length;
  const bw = Math.max(3, Math.min(24, (band * (stacked ? 0.62 : 0.8) - 2 * (k - 1)) / k));
  const maxLabels = Math.max(2, Math.floor(pw / 30));
  const every = Math.ceil(n / maxLabels);
  let bars = '', hits = '', xl = '';
  for (let i = 0; i < n; i++) {
    const cx = ml + band * i + band / 2;
    if (stacked) {
      let p = 0, q = 0;
      const segs = S.map(s => ({s, v: nz(s.values[i])})).filter(x => x.v !== 0);
      const pos = segs.filter(x => x.v > 0), neg = segs.filter(x => x.v < 0);
      pos.forEach((x, j) => {
        const y0 = y(p), y1 = y(p + x.v); p += x.v;
        const last = j === pos.length - 1, hgt = Math.max(0, y0 - y1 - (last ? 0 : 2));
        bars += last ? `<path class="bar b${i}" d="${roundTopRect(cx - bw / 2, y1, bw, hgt, 4)}" fill="${x.s.color}"/>`
                     : `<rect class="bar b${i}" x="${cx - bw / 2}" y="${y1 + 2}" width="${bw}" height="${hgt}" fill="${x.s.color}"/>`;
      });
      neg.forEach((x, j) => {
        const y0 = y(q), y1 = y(q + x.v); q += x.v;
        const last = j === neg.length - 1, hgt = Math.max(0, y1 - y0 - (last ? 0 : 2));
        bars += last ? `<path class="bar b${i}" d="${roundTopRect(cx - bw / 2, y0, bw, hgt, 4, true)}" fill="${x.s.color}"/>`
                     : `<rect class="bar b${i}" x="${cx - bw / 2}" y="${y0}" width="${bw}" height="${hgt}" fill="${x.s.color}"/>`;
      });
    } else {
      const gw = bw * k + 2 * (k - 1);
      S.forEach((s, j) => {
        const v = nz(s.values[i]); if (!v) return;
        const x0 = cx - gw / 2 + j * (bw + 2), y0 = y(0), y1 = y(v);
        bars += v >= 0 ? `<path class="bar b${i}" d="${roundTopRect(x0, y1, bw, y0 - y1, 4)}" fill="${s.color}"/>`
                       : `<path class="bar b${i}" d="${roundTopRect(x0, y0, bw, y1 - y0, 4, true)}" fill="${s.color}"/>`;
      });
    }
    hits += `<rect class="hit" data-i="${i}" x="${ml + band * i}" y="${mt}" width="${band}" height="${ph + mb}"/>`;
    const lastShown = i === n - 1 && (i % every === 0 || (i % every) >= every / 2);
    if (i % every === 0 || lastShown) xl += `<text x="${cx}" y="${H - 7}" text-anchor="middle" class="${o.hl === i ? 'lbl' : ''}">${esc(String((o.labels || o.cats)[i]))}</text>`;
  }
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.aria || '막대 차트')}">${g}${bars}${refSvg}${xl}${hits}</svg>`;
}
/* 꺾은선 */
function lineChart(o) {
  const S = o.series.filter(s => s.values.some(isNum));
  if (!S.length) return `<div class="empty">표시할 데이터가 없습니다</div>`;
  const legend = S.length > 1 ? `<div class="legend">${S.map(s => `<span><i class="ln" style="background:${s.color}"></i>${esc(s.name)}</span>`).join('')}</div>` : '';
  return placeholder('line', {...o, S}, legend);
}
function buildLine(C, W) {
  const o = C.o, S = o.S;
  const H = o.h || 220, ml = 44, mt = 14, mb = 24;
  const endLab = o.endLabels !== false && S.length <= 6 && W > 420;
  const mr = endLab ? 52 : 12;
  const pw = W - ml - mr, ph = H - mt - mb, n = o.cats.length;
  let max = -Infinity, min = Infinity;
  S.forEach(s => s.values.forEach(v => { if (isNum(v)) { max = Math.max(max, v); min = Math.min(min, v); } }));
  if (o.band) { max = Math.max(max, o.band[1]); min = Math.min(min, o.band[0]); }
  if (min > 0 && o.zero !== false) min = 0;
  const step = niceStep((max - min) || Math.abs(max) || 1, 4);
  const top = Math.ceil(max / step) * step, bot = Math.floor(min / step) * step;
  const y = v => mt + ph * (top - v) / ((top - bot) || 1);
  const x = i => ml + (n === 1 ? pw / 2 : pw * i / (n - 1));
  let g = '';
  for (let v = bot; v <= top + step * 1e-6; v += step) {
    g += `<line x1="${ml}" x2="${W - mr}" y1="${y(v)}" y2="${y(v)}" stroke="${Math.abs(v) < step * 1e-6 ? 'var(--axis)' : 'var(--grid)'}"/>`;
    g += `<text x="${ml - 6}" y="${y(v) + 4}" text-anchor="end">${axisFmt(v, o.unit)}</text>`;
  }
  let bandSvg = '';
  if (o.band) bandSvg = `<rect x="${ml}" y="${y(o.band[1])}" width="${pw}" height="${Math.max(0, y(o.band[0]) - y(o.band[1]))}" fill="var(--good)" opacity=".07"/><text x="${ml + 6}" y="${y(o.band[1]) + 12}" style="fill:var(--good);font-size:10px;font-weight:700">${esc(o.bandLabel || '목표 범위')}</text>`;
  let lines = '', ends = [];
  S.forEach(s => {
    let d = '', pen = false;
    s.values.forEach((v, i) => { if (isNum(v)) { d += (pen ? 'L' : 'M') + x(i).toFixed(1) + ',' + y(v).toFixed(1); pen = true; } else pen = false; });
    lines += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
    let li = -1; s.values.forEach((v, i) => { if (isNum(v)) li = i; });
    s.values.forEach((v, i) => { if (isNum(v) && !isNum(s.values[i - 1]) && !isNum(s.values[i + 1]) && i !== li) lines += `<circle cx="${x(i)}" cy="${y(v)}" r="3" fill="${s.color}"/>`; });
    if (li >= 0) {
      lines += `<circle cx="${x(li)}" cy="${y(s.values[li])}" r="4" fill="${s.color}" stroke="var(--surface)" stroke-width="2"/>`;
      ends.push({s, yy: y(s.values[li]), xx: x(li)});
    }
  });
  let el = '';
  if (endLab) {
    ends.sort((a, b) => a.yy - b.yy);
    for (let i = 1; i < ends.length; i++) if (ends[i].yy - ends[i - 1].yy < 13) ends[i].yy = ends[i - 1].yy + 13;
    ends.forEach(e => { el += `<text x="${W - mr + 8}" y="${e.yy + 4}" class="lbl">${esc(e.s.name)}</text>`; });
  }
  const every = Math.ceil(n / Math.max(2, Math.floor(pw / 44)));
  let xl = '';
  for (let i = 0; i < n; i++) if (i % every === 0 || (i === n - 1 && (i % every) >= every / 2)) xl += `<text x="${x(i)}" y="${H - 7}" text-anchor="middle">${esc(String((o.labels || o.cats)[i]))}</text>`;
  Object.assign(C, {x, n, ml, pw, mt, ph});
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.aria || '꺾은선 차트')}">${bandSvg}${g}${lines}${el}${xl}<line class="xh" x1="0" x2="0" y1="${mt}" y2="${mt + ph}" stroke="var(--ink3)" stroke-width="1" opacity="0"/><rect class="hit" x="${ml}" y="${mt}" width="${pw}" height="${ph}"/></svg>`;
}
/* 폭포 */
function waterfall(steps, o = {}) {
  return placeholder('wf', {...o, steps, h: o.h || 240, cats: steps.map(s => s.l), stacked: false, fmt: wonFull,
    tipTitle: i => steps[i].l, S: [{name: '금액', color: 'var(--accent)', values: steps.map(s => s.v)}]});
}
function buildWaterfall(C, W) {
  const o = C.o, steps = o.steps;
  const H = o.h, ml = 44, mr = 8, mt = 18, mb = 38;
  const pw = W - ml - mr, ph = H - mt - mb, n = steps.length;
  let run = 0; const pts = [];
  steps.forEach(s => { if (s.total) { pts.push({s, a: 0, b: s.v}); run = s.v; } else { pts.push({s, a: run, b: run + s.v}); run += s.v; } });
  const max = Math.max(0, ...pts.map(p => Math.max(p.a, p.b))), min = Math.min(0, ...pts.map(p => Math.min(p.a, p.b)));
  const step = niceStep(max - min, 4);
  const top = Math.ceil(max / step) * step, bot = Math.floor(min / step) * step;
  const y = v => mt + ph * (top - v) / ((top - bot) || 1);
  let g = '';
  for (let v = bot; v <= top + step * 1e-6; v += step)
    g += `<line x1="${ml}" x2="${W - mr}" y1="${y(v)}" y2="${y(v)}" stroke="${Math.abs(v) < step * 1e-6 ? 'var(--axis)' : 'var(--grid)'}"/><text x="${ml - 6}" y="${y(v) + 4}" text-anchor="end">${axisFmt(v)}</text>`;
  const band = pw / n, bw = Math.min(44, band * .56);
  let bars = '', hits = '', lab = '';
  pts.forEach((p, i) => {
    const cx = ml + band * i + band / 2;
    const y0 = y(Math.max(p.a, p.b)), y1 = y(Math.min(p.a, p.b));
    const col = p.s.total ? 'var(--ink1)' : (p.s.v >= 0 ? 'var(--accent)' : 'var(--bad)');
    bars += `<rect class="bar b${i}" x="${cx - bw / 2}" y="${y0}" width="${bw}" height="${Math.max(1, y1 - y0)}" rx="3" fill="${col}"/>`;
    if (i < n - 1) { const yy = y(p.b); bars += `<line x1="${cx + bw / 2}" x2="${cx + band - bw / 2}" y1="${yy}" y2="${yy}" stroke="var(--ink4)"/>`; }
    const vy = p.s.v >= 0 || p.s.total ? y0 - 5 : y1 + 13;
    lab += `<text x="${cx}" y="${vy}" text-anchor="middle" class="lbl">${esc(won(p.s.v))}</text>`;
    const words = String(p.s.l).split(' ');
    lab += `<text x="${cx}" y="${H - 21}" text-anchor="middle">${esc(words[0])}</text>` + (words[1] ? `<text x="${cx}" y="${H - 8}" text-anchor="middle">${esc(words.slice(1).join(' '))}</text>` : '');
    hits += `<rect class="hit" data-i="${i}" x="${ml + band * i}" y="${mt}" width="${band}" height="${ph}"/>`;
  });
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="이익 구조">${g}${bars}${lab}${hits}</svg>`;
}
function drawChart(el) {
  const C = CHARTS[el.id]; if (!C) return;
  const W = Math.max(260, Math.floor(el.clientWidth || el.parentElement.clientWidth || 600));
  if (C._w === W && el.firstChild) return;
  C._w = W;
  el.innerHTML = C.kind === 'col' ? buildCol(C, W) : C.kind === 'line' ? buildLine(C, W) : buildWaterfall(C, W);
  el.style.minHeight = '';
  bindChart(el, C);
}
function bindChart(el, C) {
  const svg = el.querySelector('svg'); if (!svg) return;
  const o = C.o, fmt = o.fmt || won;
  if (C.kind !== 'line') {
    svg.addEventListener('pointermove', ev => {
      const h = ev.target.closest('.hit'); if (!h) { el.classList.remove('hov'); hideTip(); return; }
      const i = +h.dataset.i;
      el.classList.add('hov');
      svg.querySelectorAll('.bar.on').forEach(b => b.classList.remove('on'));
      svg.querySelectorAll('.b' + i).forEach(b => b.classList.add('on'));
      const rows = o.S.slice().reverse().filter(s => isNum(s.values[i]) && s.values[i] !== 0).map(s => ({n: s.name, v: fmt(s.values[i]), c: C.kind === 'wf' ? null : s.color}));
      const tot = sum(o.S, s => s.values[i]);
      const foot = o.tipFoot ? o.tipFoot(i) : (o.S.length > 1 && o.stacked !== false ? {n: '합계', v: fmt(tot)} : null);
      showTip(tipRows(o.tipTitle ? o.tipTitle(i) : String(o.cats[i]), rows.length ? rows : [{n: '값', v: '–'}], foot), ev);
    });
    svg.addEventListener('pointerleave', () => { el.classList.remove('hov'); hideTip(); });
  } else {
    const xh = svg.querySelector('.xh');
    svg.addEventListener('pointermove', ev => {
      const r = svg.getBoundingClientRect(), sx = ev.clientX - r.left;
      if (sx < C.ml - 10 || sx > C.ml + C.pw + 10) { xh.setAttribute('opacity', 0); hideTip(); return; }
      const i = Math.max(0, Math.min(C.n - 1, Math.round((sx - C.ml) / (C.pw / Math.max(1, C.n - 1)))));
      xh.setAttribute('x1', C.x(i)); xh.setAttribute('x2', C.x(i)); xh.setAttribute('opacity', .5);
      const rows = o.S.map(s => ({n: s.name, v: isNum(s.values[i]) ? fmt(s.values[i]) : '–', c: s.color}));
      showTip(tipRows(o.tipTitle ? o.tipTitle(i) : String((o.labels || o.cats)[i]), rows), ev);
    });
    svg.addEventListener('pointerleave', () => { xh.setAttribute('opacity', 0); hideTip(); });
  }
}
function chartEvents(root) { if (root) root.querySelectorAll('.chart').forEach(drawChart); }
let _rsz = null;
window.addEventListener('resize', () => {
  clearTimeout(_rsz);
  _rsz = setTimeout(() => { const act = document.querySelector('.section.active'); if (act) act.querySelectorAll('.chart').forEach(el => { const C = CHARTS[el.id]; if (C) C._w = 0; drawChart(el); }); }, 150);
});
/* 가로 막대 (HTML) */
function hbars(rows, o = {}) {
  const max = Math.max(...rows.map(r => Math.abs(nz(r.v))), 1);
  const fmt = o.fmt || won;
  return rows.map(r => `<div class="hb" ${r.tip ? `title="${esc(r.tip)}"` : ''}><div class="l">${r.dot ? dot(r.dot) : ''}${esc(r.l)}</div>
    <div class="b"><i style="width:${Math.max(0.5, Math.abs(nz(r.v)) / max * 100)}%;background:${r.c || 'var(--accent)'}"></i></div>
    <div class="v">${fmt(r.v)}${r.sub ? `<small>${esc(r.sub)}</small>` : ''}</div></div>`).join('');
}
const share = (a, b) => { const r = ratio(a, b); return !isNum(r) ? '' : r > 0 && r < 0.01 ? '<1%' : fp(r, 0); };
function spark(vals, color = 'var(--accent)', w = 90, h = 24) {
  const v = vals.map(x => isNum(x) ? x : null);
  const ok = v.filter(isNum);
  if (ok.length < 2) return '';
  const mx = Math.max(...ok), mn = Math.min(...ok, 0);
  const X = i => 2 + (w - 4) * i / (v.length - 1), Y = x => h - 3 - (h - 6) * (x - mn) / ((mx - mn) || 1);
  let d = '', pen = false;
  v.forEach((x, i) => { if (isNum(x)) { d += (pen ? 'L' : 'M') + X(i).toFixed(1) + ',' + Y(x).toFixed(1); pen = true; } else pen = false; });
  let li = -1; v.forEach((x, i) => { if (isNum(x)) li = i; });
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="vertical-align:middle" aria-hidden="true"><path d="${d}" fill="none" stroke="${color}" stroke-width="1.6"/><circle cx="${X(li)}" cy="${Y(v[li])}" r="2.5" fill="${color}"/></svg>`;
}
function rangeBadge(x, rng, lowerBetter = true) {
  if (!isNum(x) || !rng) return '';
  const [lo, hi] = rng;
  if (x >= lo - 1e-9 && x <= hi + 1e-9) return `<span class="badge good">범위</span>`;
  if (lowerBetter) return x > hi ? `<span class="badge ${x > hi + 0.05 ? 'bad' : 'warn'}">+${((x - hi) * 100).toFixed(1)}%p</span>` : `<span class="badge info">낮음</span>`;
  return x < lo ? `<span class="badge ${x < 0 ? 'bad' : 'warn'}">${((x - lo) * 100).toFixed(1)}%p</span>` : `<span class="badge acc">초과</span>`;
}

/* ═══════════════════════════════════════════════
   카페 공명 대시보드 — 화면
   ═══════════════════════════════════════════════ */
const TABS = [
  {id: 'summary', label: '종합'}, {div: true},
  {id: 'sales', label: '매출'}, {id: 'pnl', label: '손익'}, {id: 'bakery', label: '베이커리'}, {id: 'beans', label: '원두·메뉴'}, {id: 'cost', label: '재고·비용'},
  {div: true},
  {id: 'staff', label: '인력'}, {id: 'mkt', label: '마케팅·리뷰'}, {id: 'expand', label: '출점'},
  {div: true},
  {id: 'check', label: '데이터 점검'}, {id: 'data', label: '입력 가이드'},
];
const UI = {tab: 'summary', m: null, st: '전체', leadStage: null, leadKind: '전체', leadQ: '', prodQ: '', prodSort: 'ship', ledgerF: '전체', invStore: '전체', prodMore: false, leadMore: false};

/* ── 공통 계산 ── */
function monthCover(m) {
  // 매출 커버리지: 지점별 마지막 날짜
  const out = {};
  for (const s in M.S.sm) { const o = M.S.sm[s][m]; if (o && o.last) out[s] = o.last; }
  return out;
}
function salesSameDays(s, m, lastDay) {
  // 전월 1~lastDay 매출
  const pm = ymAdd(m, -1), rows = M.S.sd[s] || {};
  let t = 0, n = 0;
  for (let d = 1; d <= Math.min(lastDay, dim(pm)); d++) { const r = rows[pm + '-' + pad2(d)]; if (r) { t += r._tot; if (r._tot > 0) n++; } }
  return n ? t : null;
}
function salesMonthCompare(m, stores) {
  let cur = 0, prev = 0, any = false;
  for (const s of stores) {
    const o = M.S.sm[s] && M.S.sm[s][m]; if (!o || !o.last) continue;
    const ld = Number(o.last.slice(8));
    const p = salesSameDays(s, m, ld); if (p == null) continue;
    let c = 0; for (let d = 1; d <= ld; d++) { const r = (M.S.sd[s] || {})[m + '-' + pad2(d)]; if (r) c += r._tot; }
    cur += c; prev += p; any = true;
  }
  return any && prev ? cur / prev - 1 : null;
}
function pnlCoverage(m) {
  let last = null, wk = new Set();
  M.P.rows.forEach(r => { if (r.m === m) { wk.add(r.wk); if (!last || r.we > last) last = r.we; } });
  return {last, weeks: [...wk].sort((a, b) => a - b), full: last ? last >= m + '-' + pad2(dim(m)) : false};
}
function monthElapsed(m) {
  const cov = pnlCoverage(m);
  const mi = Number(m.slice(5));
  if (cov.last && !cov.full) return (mi - 1) + Number(cov.last.slice(8)) / dim(m);
  return mi;
}
function storeTypeBadge(s) {
  const t = (M.storeMeta[s] || {}).type || '';
  if (t === '별도사업자') return ' <span class="badge info" title="㈜필름 사업자가 아님 — 손익 50% 수익분배">별도</span>';
  if (t === '위탁') return ' <span class="badge info" title="위탁 운영 — 매출수수료 7%">위탁</span>';
  if (t === '영업종료') return ' <span class="badge info">종료</span>';
  return '';
}
function wasteOf(m, s) {
  const o = M.K.st[m] && M.K.st[m][s];
  return o && o.recv ? {rate: o.waste / o.recv, ...o} : null;
}

/* ── 알림 ── */
function alertsFor(m) {
  const A = [];
  const unk = Object.entries(M.unknownSites || {});
  if (unk.length) A.push({sev: 'warn', t: `본사 시트 01_지점에 없는 지점 이름 ${unk.length}개 — 이 행들은 화면에서 빠짐`,
    d: unk.map(([s, o]) => `'${s}' ${num(o.n)}행(${[...o.tabs].map(TN).join('·')})`).join(' · ') + ' — 오타면 그 시트에서 고치고, 새 지점이면 01_지점에 한 줄 추가', tab: 'data'});
  const cov = pnlCoverage(m);
  const covTxt = cov.last ? (cov.full ? '' : ` (${dLab(cov.last)}까지)`) : '';
  const byStore = s => M.P.sm[s] && M.P.sm[s][m];
  const ps = Object.keys(M.P.sm).filter(s => byStore(s) && nz(byStore(s).rev) > 0).sort((a, b) => sOrd(a) - sOrd(b));
  ps.forEach(s => {
    const o = byStore(s), r = ratio(o._op, o.rev);
    if (r < 0) A.push({sev: 'bad', t: `${s} 영업적자 ${fp(r)}`, d: `매출 ${won(o.rev)} · 영업이익 ${won(o._op)}${covTxt}. 원가 ${fp(ratio(o._cogs, o.rev))} · 인건비 ${fp(ratio(o._labor, o.rev))} · 임차료 ${fp(ratio(o.rent, o.rev))}`, tab: 'pnl'});
    else if (r < M.rng.op[0]) A.push({sev: 'warn', t: `${s} 영업이익률 ${fp(r)} — 목표 ${fp(M.rng.op[0], 0)} 미만`, d: `영업이익 ${won(o._op)}${covTxt}`, tab: 'pnl'});
  });
  const hiC = ps.filter(s => ratio(byStore(s)._cogs, byStore(s).rev) > M.rng.cogs[1]);
  if (hiC.length) A.push({sev: 'warn', t: `원가율 목표(${fp(M.rng.cogs[0], 0)}~${fp(M.rng.cogs[1], 0)}) 초과 ${hiC.length}곳`, d: hiC.map(s => `${s} ${fp(ratio(byStore(s)._cogs, byStore(s).rev))}`).join(' · '), tab: 'pnl'});
  const hiL = ps.filter(s => ratio(byStore(s)._labor, byStore(s).rev) > M.rng.labor[1]);
  if (hiL.length) A.push({sev: 'warn', t: `인건비율 목표(~${fp(M.rng.labor[1], 0)}) 초과 ${hiL.length}곳`, d: hiL.map(s => `${s} ${fp(ratio(byStore(s)._labor, byStore(s).rev))}`).join(' · '), tab: 'pnl'});
  const F = M.F[m];
  if (F && F.prodMar < 0) A.push({sev: 'info', t: `생산(베이커리·로스터리) 마진 ${won(F.prodMar)}`, d: '직영 납품가(내부 이전가)가 생산원가보다 낮아 생산 쪽이 적자로 보이는 구조. 매장 이익과 합쳐 판단하고, 납품가 기준을 정리할 것', tab: 'pnl'});
  // 폐기율
  const ws = STORES.map(s => ({s, w: wasteOf(m, s)})).filter(x => x.w && x.w.recv > 200);
  const hiW = ws.filter(x => x.w.rate >= M.wasteWarn);
  if (hiW.length) A.push({sev: 'bad', t: `베이커리 폐기율 ${fp(M.wasteWarn, 0)} 이상 ${hiW.length}곳`, d: hiW.map(x => `${x.s} ${fp(x.w.rate)} (폐기원가 ${won(x.w.wcost)})`).join(' · '), tab: 'bakery'});
  const midW = ws.filter(x => x.w.rate >= 0.15 && x.w.rate < M.wasteWarn);
  if (midW.length) A.push({sev: 'warn', t: `베이커리 폐기율 15% 이상 ${midW.length}곳`, d: midW.map(x => `${x.s} ${fp(x.w.rate)}`).join(' · '), tab: 'bakery'});
  // 입력 누락·지연
  const lastM = M.months[M.months.length - 1];
  if (m === lastM) {
    const asOf = M.lastSalesDate;
    const late = Object.entries(M.S.last).filter(([s, d]) => d < asOf && M.S.sm[s] && M.S.sm[s][m]).map(([s, d]) => `${s} ${dLab(d)}`);
    if (late.length) A.push({sev: 'warn', t: '일매출 입력이 늦은 지점', d: late.join(' · ') + ` (다른 지점은 ${dLab(asOf)}까지)`, tab: 'sales'});
    if (cov.last && asOf && cov.last < asOf) A.push({sev: 'warn', t: `주간 손익 ${dLab(cov.last)} 이후 미입력`, d: `매출은 ${dLab(asOf)}까지 들어와 있음. 지난주 손익을 ${TNF('pnl_store')}·${TN('pnl_prod')}·${TN('pnl_hq')}에 입력`, tab: 'pnl'});
    const cardStop = STORES.filter(s => M.C.last[s] && M.C.last[s] < ymAdd(m, -1) + '-15');
    if (cardStop.length) A.push({sev: 'warn', t: `법인카드 사용내역 기록 중단 ${cardStop.length}곳`, d: cardStop.map(s => `${s} ${M.C.last[s].slice(2).replace(/-/g, '.')}`).join(' · ') + ' 이후 없음 — 0원이 아니라 미기록', tab: 'cost'});
    const rvStop = STORES.filter(s => M.R.last[s] && M.R.last[s] < ymAdd(m, -1) + '-01');
    if (rvStop.length) A.push({sev: 'info', t: `리뷰 집계 중단 ${rvStop.length}곳`, d: rvStop.map(s => `${s} ${M.R.last[s].slice(2).replace(/-/g, '.')}`).join(' · ') + ' 이후 기록 없음', tab: 'mkt'});
  }
  // T.O
  const vac = M.TO.filter(r => ['공석', '채용중', '오퍼진행'].includes(r.status));
  if (vac.length) {
    const g = groupBy(vac, r => r.s);
    A.push({sev: 'info', t: `T.O 공석 ${vac.length}자리`, d: Object.entries(g).map(([s, a]) => `${s} ${a.length}`).join(' · ') + ` (${[...new Set(vac.map(r => r.role))].join('·')})`, tab: 'staff'});
  }
  // 출점 리드
  const act = M.L.filter(r => ['연락중', '상담완료', '유망', '미팅', '협상'].includes(r.stage));
  const noNext = act.filter(r => !r.nextd);
  if (noNext.length) A.push({sev: 'info', t: `출점 리드 ${act.length}건 진행 중 — 다음 액션일 없는 건 ${noNext.length}`, d: `${TNF('leads')}에 다음 액션·날짜를 넣으면 기한 지난 건이 여기 뜹니다`, tab: 'expand'});
  if (SNAPSHOT) A.push({sev: 'bad', t: '계정·비밀번호가 평문으로 적힌 탭', d: '신사 파일 \'공명 어드민\', 각 지점 \'계정관리\' 탭 — 공유 시트에서 빼고 비밀번호 변경', tab: 'check'});
  const ord = {bad: 0, warn: 1, info: 2};
  return A.sort((a, b) => ord[a.sev] - ord[b.sev]);
}
const SEV = {bad: '<span class="badge bad">긴급</span>', warn: '<span class="badge warn">주의</span>', info: '<span class="badge info">확인</span>'};
function alertsHTML(A, max) {
  if (!A.length) return '<div class="empty">이번 달 점검할 항목이 없습니다</div>';
  return `<div class="alerts">${A.slice(0, max || A.length).map(a => `<div class="alert"><div>${SEV[a.sev]}</div><div><div class="t">${esc(a.t)}</div><div class="d">${esc(a.d)}</div></div>${a.tab ? `<button data-go="${a.tab}">열기</button>` : ''}</div>`).join('')}</div>`;
}

/* ── 상단 KPI ── */
function renderPills() {
  const m = UI.m, y = m.slice(0, 4);
  const ms = M.pnlMonths.filter(x => x.startsWith(y) && x <= m);
  const ytd = sum(ms, x => M.F[x].corpRev), ytdNet = sum(ms, x => M.F[x].net);
  const tgt = M.target, ach = tgt ? ytd / tgt : null;
  const el = Math.min(12, monthElapsed(ms[ms.length - 1] || m));
  const remain = 12 - el;
  const need = tgt && remain > 0 ? (tgt - ytd) / remain : null;
  const cov = pnlCoverage(ms[ms.length - 1] || m);
  const covTxt = cov.last ? `${dLab(cov.last)}까지 반영` : '';
  const stores = Object.keys(M.S.sm).filter(s => M.S.sm[s][m]);
  const mtd = sum(stores, s => M.S.sm[s][m]._tot);
  const lastD = stores.map(s => M.S.sm[s][m].last).sort().pop();
  const cmp = salesMonthCompare(m, stores);
  const netM = M.F[m] ? M.F[m].net : null;
  $('#pillBar').innerHTML = `
    <div class="pill"><div class="pill-lbl">연 누적 매출 · 법인</div><div class="pill-val">${won(ytd)}</div><div class="pill-sub">연목표 ${won(tgt)} · ${esc(covTxt)}</div></div>
    <div class="pill"><div class="pill-lbl">연 매출 달성률</div><div class="pill-val ${ach >= el / 12 ? 'up' : ''}">${isNum(ach) ? (ach * 100).toFixed(1) : '–'}<small>%</small></div>
      <div class="pill-meter" title="진행률 ${fp(el / 12, 0)}"><i style="width:${Math.min(100, nz(ach) * 100)}%"></i></div>
      <div class="pill-sub">${need ? `남은 ${remain.toFixed(1)}개월 월 ${won(need)} 필요` : ''}</div></div>
    <div class="pill"><div class="pill-lbl">${mLab(m)} 매장 매출 · POS</div><div class="pill-val">${won(mtd)}</div><div class="pill-sub">${lastD ? `${Number(m.slice(5))}/1~${dLab(lastD)} · ` : ''}${isNum(cmp) ? `전월 동기 ${fpp(cmp)}` : `${stores.length}개 지점`}</div></div>
    <div class="pill"><div class="pill-lbl">연 누적 순이익</div><div class="pill-val ${ytdNet < 0 ? 'dn' : ''}">${won(ytdNet)}</div><div class="pill-sub">${mLab(m)} ${won(netM)}${M.F[m] && !pnlCoverage(m).full && pnlCoverage(m).last ? ` · ${dLab(pnlCoverage(m).last)}까지` : ''}</div></div>`;
}

/* ═════════ 종합 ═════════ */
function renderSummary() {
  const m = UI.m, pm = ymAdd(m, -1);
  const cov = pnlCoverage(m), scov = monthCover(m);
  let h = '';
  const lastSales = Object.values(scov).sort().pop();
  if (!cov.full && cov.last) h += `<div class="notice"><div>ⓘ</div><div><b>${mLab(m)}은 진행 중인 달입니다.</b> 매출은 ${dLab(lastSales)}까지, 손익은 ${dLab(cov.last)}까지(${cov.weeks.length}주) 입력돼 있어 손익 수치는 그 기간 기준입니다.</div></div>`;

  // 지점 한눈에
  const rowsS = STORES.filter(s => (M.S.sm[s] && M.S.sm[s][m]) || (M.P.sm[s] && M.P.sm[s][m] && nz(M.P.sm[s][m].rev)) || (M.K.ship[m] && M.K.ship[m][s]));
  const tr = rowsS.map(s => {
    const so = M.S.sm[s] && M.S.sm[s][m], po = M.P.sm[s] && M.P.sm[s][m], w = wasteOf(m, s);
    const cmp = so ? salesMonthCompare(m, [s]) : null;
    const rv = M.R.sm[s] && M.R.sm[s][m];
    const opr = po && po.rev ? ratio(po._op, po.rev) : null;
    const hist = M.months.map(x => M.S.sm[s] && M.S.sm[s][x] ? M.S.sm[s][x]._tot / Math.max(1, M.S.sm[s][x].days) : null);
    return `<tr>
      <td>${dot(s)}<b>${esc(s)}</b>${storeTypeBadge(s)}</td>
      <td class="n">${so ? won(so._tot) : '<span class="muted">–</span>'}${so ? `<span class="sm">일평균 ${won(so._tot / Math.max(1, so.days))}</span>` : ''}</td>
      <td class="n ${deltaCls(cmp)}">${fpp(cmp)}</td>
      <td class="n">${so ? fp(ratio(so._dlv, so._tot), 0) : '–'}</td>
      <td>${spark(hist, sc(s))}</td>
      <td class="n">${po && po.rev ? won(po.rev) : (M.storeMeta[s] && String(M.storeMeta[s].type || '').trim() === '별도사업자' ? '<span class="muted">별도 사업자</span>' : '–')}</td>
      <td class="n ${isNum(opr) && opr < 0 ? 'dn' : ''}">${po && po.rev ? won(po._op) : '–'}${isNum(opr) ? `<span class="sm">${fp(opr)}</span>` : ''}</td>
      <td class="n">${po && po.rev ? fp(ratio(po._cogs, po.rev)) + ' ' + rangeBadge(ratio(po._cogs, po.rev), M.rng.cogs) : '–'}</td>
      <td class="n">${po && po.rev ? fp(ratio(po._labor, po.rev)) : '–'}</td>
      <td class="n ${w && w.rate >= M.wasteWarn ? 'dn' : ''}">${w ? fp(w.rate) : '–'}</td>
      <td class="n">${rv ? num(rv.total) : '–'}</td></tr>`;
  }).join('');
  const corpS = rowsS.filter(s => M.corp(s));
  const tot = (list) => {
    const so = list.map(s => M.S.sm[s] && M.S.sm[s][m]).filter(Boolean);
    const po = list.map(s => M.P.sm[s] && M.P.sm[s][m]).filter(Boolean);
    const rev = sum(po, o => o.rev), op = sum(po, o => o._op);
    const t = sum(so, o => o._tot), dl = sum(so, o => o._dlv);
    const wl = list.map(s => wasteOf(m, s)).filter(Boolean);
    const rv = sum(list, s => M.R.sm[s] && M.R.sm[s][m] ? M.R.sm[s][m].total : 0);
    return {t, dl, rev, op, cmp: salesMonthCompare(m, list), cogs: sum(po, o => o._cogs), labor: sum(po, o => o._labor),
            wr: sum(wl, x => x.recv) ? sum(wl, x => x.waste) / sum(wl, x => x.recv) : null, rv};
  };
  const tRow = (lab, x) => `<tr class="tot"><td>${lab}</td><td class="n">${won(x.t)}</td><td class="n ${deltaCls(x.cmp)}">${fpp(x.cmp)}</td><td class="n">${fp(ratio(x.dl, x.t), 0)}</td><td></td>
    <td class="n">${won(x.rev)}</td><td class="n">${won(x.op)}<span class="sm">${fp(ratio(x.op, x.rev))}</span></td><td class="n">${fp(ratio(x.cogs, x.rev))}</td><td class="n">${fp(ratio(x.labor, x.rev))}</td><td class="n">${fp(x.wr)}</td><td class="n">${x.rv ? num(x.rv) : '–'}</td></tr>`;
  h += `<div class="sec-label">지점 한눈에 · ${mLab(m, true)}</div>
  <div class="card"><div class="tbl-wrap"><table>
    <tr><th>지점</th><th class="n">매출 (POS, VAT 포함)</th><th class="n">전월 동기</th><th class="n">배달 비중</th><th>일평균 추이</th><th class="n">순매출 (손익)</th><th class="n">영업이익</th><th class="n">원가율</th><th class="n">인건비율</th><th class="n">폐기율</th><th class="n">리뷰</th></tr>
    ${tr}${tRow('법인 합계', tot(corpS))}${rowsS.length !== corpS.length ? tRow('전체', tot(rowsS)) : ''}
  </table></div>
  <div class="note">매출(POS)은 점포레포트 일매출 합계(할인 전, VAT 포함). 순매출·영업이익은 주간 손익(POS÷1.1). 전월 동기 = 같은 지점의 전월 1일~같은 날짜. 폐기율 = 폐기 ÷ 입고(리뷰 쿠키 제외). 신사는 별도 사업자라 법인 합계에서 빠지고, 수익분배만 본사 부가수익으로 들어갑니다.</div></div>`;

  // 추이 + 이익 구조
  const yms = M.pnlMonths.filter(x => x.startsWith(m.slice(0, 4)) && x <= m);
  const pStores = STORES.filter(s => yms.some(x => M.P.sm[s] && M.P.sm[s][x] && M.P.sm[s][x].rev));
  const F = M.F[m] || {};
  const colT = colChart({cats: yms, labels: yms.map(x => mLab(x)), h: 230, aria: '월별 매장 순매출',
    series: pStores.map(s => ({name: s, color: sc(s), values: yms.map(x => M.P.sm[s] && M.P.sm[s][x] ? M.P.sm[s][x].rev : null)})),
    tipTitle: i => mLab(yms[i], true) + ' 매장 순매출' + (pnlCoverage(yms[i]).full ? '' : ` (${dLab(pnlCoverage(yms[i]).last)}까지)`), hl: yms.indexOf(m)});
  const tbl = `<div class="tbl-wrap" style="margin-top:12px"><table>
    <tr><th>월</th><th class="n">매장 순매출</th><th class="n">생산 외부매출</th><th class="n">부가수익</th><th class="n">법인 매출</th><th class="n">매장 영업이익</th><th class="n">제조 이익</th><th class="n">본사 비용</th><th class="n">최종 순이익</th></tr>
    ${yms.map(x => { const f = M.F[x]; return `<tr${x === m ? ' class="grp"' : ''}><td>${mLab(x)}${pnlCoverage(x).full ? '' : ' <span class="badge info">~' + dLab(pnlCoverage(x).last) + '</span>'}</td><td class="n">${man(f.storeRev)}</td><td class="n">${man(f.prodExt)}</td><td class="n">${man(f.inc)}</td><td class="n"><b>${man(f.corpRev)}</b></td><td class="n">${man(f.storeOp)}</td><td class="n ${f.prodMar < 0 ? 'dn' : ''}">${man(f.prodMar)}</td><td class="n">${man(-f.hqCost)}</td><td class="n ${f.net < 0 ? 'dn' : ''}"><b>${man(f.net)}</b></td></tr>`; }).join('')}
    <tr class="tot"><td>누적</td>${['storeRev', 'prodExt', 'inc', 'corpRev', 'storeOp', 'prodMar'].map(k => `<td class="n">${man(sum(yms, x => M.F[x][k]))}</td>`).join('')}<td class="n">${man(-sum(yms, x => M.F[x].hqCost))}</td><td class="n">${man(sum(yms, x => M.F[x].net))}</td></tr>
  </table></div><div class="note">단위 만원 · VAT 제외. 법인 매출 = 법인 매장 순매출 + 생산 외부매출(신사·마곡(1~3월)·DMC·온라인 납품) + 부가수익. 최종 순이익 = 매장 영업이익 + 제조 이익 + 부가수익 − 본사 비용 (주간 손익 기준, 법인세 등 제외).</div>`;
  const wf = F.stores ? waterfall([
    {l: '매장 영업이익', v: F.storeOp}, {l: '제조 이익', v: F.prodMar}, {l: '부가 수익', v: F.inc}, {l: '본사 비용', v: -F.hqCost}, {l: '최종 순이익', v: F.net, total: true}], {h: 250}) : '<div class="empty">손익 데이터 없음</div>';
  h += `<div class="sec-label">매출·이익 흐름</div><div class="g2">
    <div class="card"><div class="card-title">월별 매장 순매출 <small>주간 손익 · VAT 제외 · 막대를 가리키면 지점별 금액</small></div>${colT}${tbl}</div>
    <div class="card"><div class="card-title">이익 구조 <small>${mLab(m, true)}${cov.full ? '' : ' · ' + dLab(cov.last) + '까지'}</small></div>${wf}
      ${F.prodMar < 0 ? `<div class="note"><b>제조 이익이 음수인 이유</b> — 연남 베이커리·합정 로스터리가 직영 매장에 넘기는 값(내부 이전가, ${mLab(m)} ${won(F.prodDir)})이 생산원가보다 낮게 잡혀 있어서입니다. 그만큼 매장 원가가 낮아 매장 이익이 커 보이므로 두 값을 합쳐서 봐야 합니다.</div>` : ''}
      ${targetCard(m)}</div></div>`;

  // 알림
  const A = alertsFor(m);
  h += `<div class="sec-label">점검 필요 · ${A.length}건</div><div class="card">${alertsHTML(A)}</div>`;
  $('#tab-summary').innerHTML = h;
}
function targetCard(m) {
  if (!M.target) return '';
  const y = m.slice(0, 4);
  const ms = M.pnlMonths.filter(x => x.startsWith(y));
  const pace = M.target / 12;
  const all = monthsBetween(y + '-01', y + '-12');
  const vals = all.map(x => M.F[x] ? M.F[x].corpRev : null);
  const c = colChart({cats: all, labels: all.map(x => Number(x.slice(5))), h: 150, legend: false, aria: '월별 법인 매출과 목표 속도',
    series: [{name: '법인 매출', color: 'var(--accent)', values: vals}], ref: pace,
    tipTitle: i => mLab(all[i], true), tipFoot: i => ({n: '월 목표 속도', v: won(pace)}), hl: all.indexOf(m)});
  return `<div style="margin-top:18px;padding-top:14px;border-top:1px solid var(--border)"><div class="card-title" style="margin-bottom:4px">연 목표 속도 <small>월 ${won(pace)} = 연 ${won(M.target)} ÷ 12</small></div>${c}</div>`;
}

/* ═════════ 매출 ═════════ */
function renderSales() {
  const m = UI.m;
  const avail = STORES.filter(s => M.S.sm[s] && M.S.sm[s][m]);
  if (UI.st !== '전체' && !avail.includes(UI.st)) UI.st = '전체';
  const sel = UI.st === '전체' ? avail : [UI.st];
  const days = monthsDays(m);
  const rowsFor = s => days.map(d => (M.S.sd[s] || {})[d]);
  const agg = {};
  sel.forEach(s => { const o = M.S.sm[s][m]; for (const k in o) if (isNum(o[k])) agg[k] = (agg[k] || 0) + o[k]; });
  const nd = Math.max(...sel.map(s => M.S.sm[s][m].days), 0);
  const cmp = salesMonthCompare(m, sel);
  let h = `<div class="filters">${['전체'].concat(avail).map(s => `<button class="chip ${UI.st === s ? 'on' : ''}" data-st="${s}">${s !== '전체' ? dot(s) : ''}${s}</button>`).join('')}
    <span class="muted" style="margin-left:6px;font-size:11.5px">POS 총매출 · 할인 전 · VAT 포함</span></div>`;
  if (!avail.length) { $('#tab-sales').innerHTML = h + '<div class="card empty">이 달 일매출 데이터가 없습니다</div>'; return; }
  h += `<div class="g4">
    <div class="kpi"><div class="kpi-lbl">${mLab(m)} 매출</div><div class="kpi-val">${won(agg._tot)}</div><div class="kpi-sub">${nd}일 · 일평균 <b>${won(agg._tot / Math.max(1, nd) * (UI.st === '전체' ? 1 : 1))}</b>${UI.st === '전체' ? ` <span class="muted">(${sel.length}곳 합)</span>` : ''}</div></div>
    <div class="kpi"><div class="kpi-lbl">전월 동기 대비</div><div class="kpi-val ${deltaCls(cmp)}">${fpp(cmp)}</div><div class="kpi-sub">같은 지점 · 전월 1일~같은 날짜</div></div>
    <div class="kpi"><div class="kpi-lbl">배달 비중</div><div class="kpi-val">${fp(ratio(agg._dlv, agg._tot))}</div><div class="kpi-sub">배민 <b>${won(agg._bm)}</b> · 쿠팡이츠 <b>${won(agg._cp)}</b>${agg._yg ? ` · 요기요 ${won(agg._yg)}` : ''}</div></div>
    <div class="kpi"><div class="kpi-lbl">할인·포인트</div><div class="kpi-val">${won(agg._adj)}</div><div class="kpi-sub">매출의 <b>${fp(-ratio(agg._adj, agg._tot))}</b> · 협찬할인 ${won(agg.disc)} · 포인트 ${won(agg.pt)}</div></div></div>`;
  // 일별 차트
  let series;
  if (UI.st === '전체') series = sel.map(s => ({name: s, color: sc(s), values: rowsFor(s).map(r => r ? r._tot : null)}));
  else series = [{name: '매장', color: sc(UI.st), values: rowsFor(UI.st).map(r => r ? r._hall : null)}, {name: '배달', color: GRAY, values: rowsFor(UI.st).map(r => r ? r._dlv : null)}];
  const daily = colChart({cats: days, labels: days.map(d => Number(d.slice(8)) + (dowOf(d) === 0 || dowOf(d) === 6 ? '' : '')), h: 240, series, aria: '일별 매출',
    tipTitle: i => `${dLab(days[i])} (${DOW[dowOf(days[i])]})`});
  // 요일별
  const dw = [1, 2, 3, 4, 5, 6, 0].map(k => {
    const vals = days.filter(d => dowOf(d) === k).map(d => sum(sel, s => { const r = (M.S.sd[s] || {})[d]; return r ? r._tot : null; })).filter(v => v > 0);
    return vals.length ? sum(vals) / vals.length : null;
  });
  const dowC = colChart({cats: ['월', '화', '수', '목', '금', '토', '일'], h: 200, legend: false, stacked: false, aria: '요일별 일평균 매출',
    series: [{name: '일평균', color: UI.st === '전체' ? 'var(--accent)' : sc(UI.st), values: dw}], tipTitle: i => ['월', '화', '수', '목', '금', '토', '일'][i] + '요일 평균'});
  h += `<div class="sec-label">일별 매출</div><div class="card">${daily}</div>`;
  // 채널·품목
  const ch = [
    {l: '매장 음료', v: agg.bev}, {l: '매장 베이커리', v: agg.bak}, {l: '매장 원두', v: agg.bean}, {l: '도서', v: agg.book},
    {l: '기타·럭키밀', v: nz(agg.etc) + nz(agg.lucky) + nz(agg.ably)}, {l: '배민', v: agg._bm, c: GRAY}, {l: '쿠팡이츠', v: agg._cp, c: GRAY}, {l: '요기요', v: agg._yg, c: GRAY},
  ].filter(x => nz(x.v) > 0).map(x => ({...x, sub: share(x.v, agg._tot)}));
  const cat = [{l: '음료', v: agg._bevAll}, {l: '베이커리', v: agg._bakAll}, {l: '원두', v: agg._beanAll}, {l: '도서·기타', v: agg._otherAll}]
    .filter(x => nz(x.v) > 0).map(x => ({...x, sub: share(x.v, agg._tot)}));
  h += `<div class="g3 gap">
    <div class="card"><div class="card-title">채널별 <small>회색 = 배달</small></div>${hbars(ch)}</div>
    <div class="card"><div class="card-title">품목별 <small>매장+배달 합산</small></div>${hbars(cat)}<div class="note">베이커리 비중이 높을수록 폐기율 관리가 매출에 직접 영향을 줍니다.</div></div>
    <div class="card"><div class="card-title">요일별 일평균</div>${dowC}</div></div>`;
  // 월별 표
  const yms = M.months;
  h += `<div class="sec-label">지점별 월 매출 (POS)</div><div class="card"><div class="tbl-wrap"><table>
    <tr><th>지점</th>${yms.map(x => `<th class="n">${mLab(x)}</th>`).join('')}<th class="n">전월 대비</th></tr>
    ${STORES.filter(s => M.S.sm[s]).map(s => {
      const cur = M.S.sm[s][m], prev = M.S.sm[s][ymAdd(m, -1)];
      const full = cur && prev && cur.days >= dim(m) - 1;
      return `<tr><td>${dot(s)}${s}</td>${yms.map(x => { const o = M.S.sm[s][x]; return `<td class="n${x === m ? '' : ''}">${o ? man(o._tot) : '<span class="muted">·</span>'}${o && o.days < dim(x) - 1 ? `<span class="sm">${o.days}일</span>` : ''}</td>`; }).join('')}
      <td class="n ${full ? deltaCls(cur._tot / prev._tot - 1) : ''}">${full ? fpp(cur._tot / prev._tot - 1) : (cur && prev ? `<span class="muted">${fpp(salesMonthCompare(m, [s]))}</span>` : '–')}</td></tr>`;
    }).join('')}
    <tr class="tot"><td>합계</td>${yms.map(x => `<td class="n">${man(sum(STORES, s => M.S.sm[s] && M.S.sm[s][x] ? M.S.sm[s][x]._tot : 0))}</td>`).join('')}<td></td></tr>
  </table></div><div class="note">단위 만원. 작은 글씨 = 기록된 일수(한 달이 다 차지 않은 달). 전월 대비는 두 달 모두 다 찬 경우 월 합계로, 진행 중인 달은 같은 기간(회색)으로 비교합니다. 데이터는 지점 워크북에 있는 달부터 — 연남 1월, 홍대 2월, 망원 5월, 마곡·신사 6월.</div></div>`;
  // 메모
  const memos = [];
  sel.forEach(s => days.forEach(d => { const r = (M.S.sd[s] || {})[d]; if (r && r.memo) memos.push({s, d, t: r.memo}); }));
  h += `<div class="sec-label">이슈·본사 전달사항 · ${memos.length}건</div><div class="card">${memos.length ? `<div class="tbl-wrap"><table><tr><th>날짜</th><th>지점</th><th>내용</th></tr>${memos.sort((a, b) => a.d < b.d ? 1 : -1).map(x => `<tr><td class="muted" style="white-space:nowrap">${dLab(x.d)}</td><td style="white-space:nowrap">${dot(x.s)}${esc(x.s)}</td><td>${esc(x.t)}</td></tr>`).join('')}</table></div>` : `<div class="empty">이 달 기록된 이슈가 없습니다. ${esc(TNF('sales'))} 메모 칸에 한 줄씩 적으면 여기에 모입니다.</div>`}</div>`;
  $('#tab-sales').innerHTML = h;
}
function monthsDays(m) { const n = dim(m); return Array.from({length: n}, (_, i) => m + '-' + pad2(i + 1)); }

/* ═════════ 손익 ═════════ */
function renderPnl() {
  const m = UI.m, cov = pnlCoverage(m);
  let h = '';
  if (!cov.last) { $('#tab-pnl').innerHTML = '<div class="card empty">이 달 손익 데이터가 없습니다</div>'; return; }
  if (!cov.full) h += `<div class="notice"><div>ⓘ</div><div><b>${mLab(m)} 손익은 ${dLab(cov.last)}까지(${cov.weeks.join('·')}주차) 입력됨.</b> 보험료·임차료 같은 월 비용은 주별로 나눠 넣기 때문에 기간 비율대로만 반영돼 있습니다.</div></div>`;
  const st = STORES.filter(s => M.P.sm[s] && M.P.sm[s][m] && (nz(M.P.sm[s][m].rev) || nz(M.P.sm[s][m]._cost)));
  const cols = st.map(s => M.P.sm[s][m]);
  const T = {}; cols.forEach(o => { for (const k in o) if (isNum(o[k])) T[k] = (T[k] || 0) + o[k]; });
  const allC = cols.concat([T]);
  const L = [
    ['매출', 'rev', 'grp'],
    ['원가', '_cogs', 'grp', 'cogs'], ['음료 (SPC 발주)', 'c_bev', 'sub'], ['원두 (로스터리 납품)', 'c_bean', 'sub'], ['베이커리 (연남 납품)', 'c_bak', 'sub'],
    ['인건비', '_labor', 'grp', 'labor'], ['바리스타 정직원', 'l_ft', 'sub'], ['바리스타 PT', 'l_pt', 'sub'],
    ['기타', '_other', 'grp', 'other'], ['배민 수수료', 'f_bm', 'sub'], ['쿠팡이츠 수수료', 'f_cp', 'sub'], ['카드 수수료', 'f_card', 'sub'], ['보험료', 'ins', 'sub'], ['국민연금', 'pen', 'sub'], ['복리후생비', 'wel', 'sub'], ['소모품비', 'sup', 'sub'], ['전기·수도·가스', 'util', 'sub'],
    ['임차료', 'rent', 'grp', 'rent'],
    ['비용 총합', '_cost', 'grp'],
    ['영업이익', '_op', 'tot', 'op'],
  ];
  const cell = (o, k, rk) => {
    const v = o[k], r = ratio(v, o.rev);
    let cls = '';
    if (rk && isNum(r)) { const [lo, hi] = M.rng[rk]; if (rk === 'op') cls = r < 0 ? 'dn' : (r < lo ? 'warn-t' : ''); else if (r > hi + 1e-9) cls = 'dn'; }
    return `<td class="n">${man(v)}${k !== 'rev' && isNum(r) ? `<span class="sm ${cls}" style="${cls === 'dn' ? 'color:var(--bad)' : cls === 'warn-t' ? 'color:var(--warn)' : ''}">${fp(r)}</span>` : ''}</td>`;
  };
  h += `<div class="sec-label">매장 손익 · ${mLab(m, true)}</div><div class="card"><div class="tbl-wrap"><table>
    <tr><th>항목</th>${st.map(s => `<th class="n">${dot(s)}${s}</th>`).join('')}<th class="n">전지점</th><th>목표 범위</th></tr>
    ${L.map(([lab, k, cls, rk]) => `<tr class="${cls}"><td>${lab}</td>${allC.map(o => cell(o, k, rk)).join('')}<td class="muted" style="font-size:11px">${rk ? fp(M.rng[rk][0], 0) + '~' + fp(M.rng[rk][1], 0) : ''}</td></tr>`).join('')}
  </table></div><div class="note">단위 만원 · VAT 제외 · 작은 글씨는 매출 대비 비율(목표 범위를 넘으면 빨간색). 원가·인건비·기타 합계와 영업이익은 하위 항목을 더해 다시 계산한 값입니다 — 원본 시트의 전지점 '기타' 세부 행 참조 오류는 여기서 바로잡혀 있습니다.</div></div>`;
  // 월별 이익률 추이
  const yms = M.pnlMonths.filter(x => x.startsWith(m.slice(0, 4)));
  const ps = STORES.filter(s => (M.storeMeta[s] || {}).type !== '영업종료' && yms.some(x => M.P.sm[s] && M.P.sm[s][x] && M.P.sm[s][x].rev > 0));
  const opl = lineChart({cats: yms, labels: yms.map(x => mLab(x)), h: 230, unit: 'pct', fmt: v => fp(v), band: M.rng.op, bandLabel: `목표 ${fp(M.rng.op[0], 0)}~${fp(M.rng.op[1], 0)}`, zero: false, aria: '월별 영업이익률',
    series: ps.map(s => ({name: s, color: sc(s), values: yms.map(x => { const o = M.P.sm[s] && M.P.sm[s][x]; return o && o.rev > 0 ? o._op / o.rev : null; })}))});
  const cogl = lineChart({cats: yms, labels: yms.map(x => mLab(x)), h: 230, unit: 'pct', fmt: v => fp(v), band: M.rng.cogs, bandLabel: `목표 ${fp(M.rng.cogs[0], 0)}~${fp(M.rng.cogs[1], 0)}`, zero: false, aria: '월별 원가율',
    series: ps.map(s => ({name: s, color: sc(s), values: yms.map(x => { const o = M.P.sm[s] && M.P.sm[s][x]; return o && o.rev > 0 ? o._cogs / o.rev : null; })}))});
  h += `<div class="g2e gap"><div class="card"><div class="card-title">영업이익률 추이 <small>월별</small></div>${opl}</div><div class="card"><div class="card-title">원가율 추이 <small>음료+원두+베이커리 ÷ 매출</small></div>${cogl}</div></div>`;

  // 생산
  const fac = FACILITIES.filter(f => M.PR.sm[f] && M.PR.sm[f][m]);
  if (fac.length) {
    const fc = fac.map(f => M.PR.sm[f][m]);
    const FT = {}; fc.forEach(o => { for (const k in o) if (isNum(o[k])) FT[k] = (FT[k] || 0) + o[k]; });
    const all = fc.concat([FT]);
    const PL = [['매출', '_rev', 'grp'], ['직영점 납품 (내부)', 'r_dir', 'sub'], ['신사 납품', 'r_sinsa', 'sub'], ['마곡 납품', 'r_magok', 'sub'], ['DMC 납품', 'r_dmc', 'sub'], ['온라인·기타', 'r_etc', 'sub'],
      ['재료비', '_mat', 'grp', 'pmat'], ['생두', 'm_green', 'sub'], ['베이커리 재료', 'm_bak', 'sub'], ['두바이(두쫀쿠) 재료', 'm_dubai', 'sub'],
      ['노무비', '_lab', 'grp', 'plab'], ['파티셰 정직원', 'l_ft', 'sub'], ['파티셰 PT', 'l_pt', 'sub'], ['로스터', 'l_roast', 'sub'],
      ['제조경비', '_oh', 'grp', 'poh'], ['배송비', 'o_ship', 'sub'], ['소모품비', 'o_sup', 'sub'], ['전기·수도·가스', 'o_util', 'sub'], ['임차료', 'o_rent', 'sub'],
      ['비용 총합', '_cost', 'grp'], ['제조 마진', '_mar', 'tot', 'pmar']];
    const pc = (o, k, rk) => { const v = o[k], r = ratio(v, o._rev); const bad = rk && isNum(r) && (rk === 'pmar' ? r < M.rng.pmar[0] : r > M.rng[rk][1]);
      return `<td class="n ${k === '_mar' && v < 0 ? 'dn' : ''}">${isNum(v) && v !== 0 ? man(v) : '<span class="muted">·</span>'}${k !== '_rev' && isNum(r) && v ? `<span class="sm" style="${bad ? 'color:var(--bad)' : ''}">${fp(r)}</span>` : ''}</td>`; };
    h += `<div class="sec-label">생산 손익 · 연남 베이커리 · 합정 로스터리</div><div class="card"><div class="tbl-wrap"><table>
      <tr><th>항목</th>${fac.map(f => `<th class="n">${f}</th>`).join('')}<th class="n">합계</th><th>목표 범위</th></tr>
      ${PL.map(([lab, k, cls, rk]) => `<tr class="${cls}"><td>${lab}</td>${all.map(o => pc(o, k, rk)).join('')}<td class="muted" style="font-size:11px">${rk ? fp(M.rng[rk][0], 0) + '~' + fp(M.rng[rk][1], 0) : ''}</td></tr>`).join('')}
    </table></div><div class="note">단위 만원. 직영점 납품은 내부 이전가라 법인 매출에서는 빠지고(매장 매출과 이중 계산 방지), 제조 마진에는 들어갑니다. 원본 시트의 합계 수식 오류(2월 노무비 합계 삭제, 3월 원두 납품 소계 직접 입력, 5~6월 신사 원두 이중 합산)는 하위 항목 합으로 바로잡은 값입니다.</div></div>`;
  }

  // 본사·최종
  const Hm = M.H.m[m] || {items: {}, inc: 0, cost: 0};
  const inc = Object.entries(Hm.items).filter(([k]) => k[0] === '+').sort((a, b) => b[1] - a[1]);
  const cst = Object.entries(Hm.items).filter(([k]) => k[0] === '-').sort((a, b) => b[1] - a[1]);
  const F = M.F[m] || {};
  const net = M.pnlMonths.filter(x => x.startsWith(m.slice(0, 4)));
  const netC = colChart({cats: net, labels: net.map(x => mLab(x)), h: 200, stacked: false, legend: false, aria: '월별 최종 순이익',
    series: [{name: '최종 순이익', color: 'var(--accent)', values: net.map(x => M.F[x].net)}], fmt: wonFull,
    tipTitle: i => mLab(net[i], true) + ' 최종 순이익' + (pnlCoverage(net[i]).full ? '' : ` (${dLab(pnlCoverage(net[i]).last)}까지)`),
    tipFoot: i => (typeof NETSHEET !== 'undefined' && NETSHEET[net[i]] != null && Math.abs(NETSHEET[net[i]] - M.F[net[i]].net) > 1000) ? {n: '원본 시트 값', v: wonFull(NETSHEET[net[i]])} : null, hl: net.indexOf(m)});
  h += `<div class="sec-label">본사 정산 · 최종 순이익</div><div class="g2">
    <div class="card"><div class="card-title">월별 최종 순이익 <small>막대를 가리키면 원본 시트 값과 비교</small></div>${netC}
      <div class="note">2월(−698만)·3월(+351만)·5~8월(±30만 안팎)은 원본 시트의 합계 수식 오류를 바로잡아 원본과 다릅니다. 자세한 내용은 <a href="#" data-go="check">데이터 점검</a>.</div></div>
    <div class="card"><div class="card-title">${mLab(m)} 부가수익 · 본사비용</div>
      <div class="tbl-wrap"><table><tr><th>항목</th><th class="n">금액</th></tr>
      <tr class="grp"><td>부가수익</td><td class="n">${wonFull(Hm.inc)}</td></tr>
      ${inc.map(([k, v]) => `<tr class="sub"><td>${esc(k.slice(1))}</td><td class="n">${wonFull(v)}</td></tr>`).join('') || '<tr class="sub"><td class="muted">없음</td><td></td></tr>'}
      <tr class="grp"><td>본사비용</td><td class="n">${wonFull(-Hm.cost)}</td></tr>
      ${cst.map(([k, v]) => `<tr class="sub"><td>${esc(k.slice(1))}</td><td class="n">${wonFull(-v)}</td></tr>`).join('') || '<tr class="sub"><td class="muted">없음</td><td></td></tr>'}
      <tr class="tot"><td>최종 순이익</td><td class="n">${wonFull(F.net)}</td></tr></table></div>
      <div class="note">신사 수익분배는 주간 손익에 월 175만원 고정 추정으로 들어가 있습니다. 신사 손익집계표의 실제 분배액(월 99만~792만)과 차이가 있으니 월말에 실제값으로 바꿔 넣으세요.</div></div></div>`;
  $('#tab-pnl').innerHTML = h;
}

/* ═════════ 베이커리 ═════════ */
function renderBakery() {
  const m = UI.m, K = M.K;
  if (!K.rowsShip.length && !K.rowsStore.length) { $('#tab-bakery').innerHTML = `<div class="card empty">${SOURCE.mode === 'live' ? '베이커리 탭(07·08)을 불러오는 중이거나 비어 있습니다' : '베이커리 데이터 없음'}</div>`; return; }
  const ship = K.ship[m] || {}, st = K.st[m] || {};
  const shipQ = sum(Object.values(ship), o => o.qty), shipA = sum(Object.values(ship), o => o.amt), shipC = sum(Object.values(ship), o => o.cost);
  const recv = sum(Object.values(st), o => o.recv), waste = sum(Object.values(st), o => o.waste), wcost = sum(Object.values(st), o => o.wcost), sold = sum(Object.values(st), o => o.sold);
  let h = `<div class="g4">
    <div class="kpi"><div class="kpi-lbl">${mLab(m)} 중앙 출고</div><div class="kpi-val">${num(shipQ)}<small>개</small></div><div class="kpi-sub">${Object.keys(ship).length}개 지점 · 생산원가 <b>${won(shipC)}</b></div></div>
    <div class="kpi"><div class="kpi-lbl">출고액 (납품가 환산)</div><div class="kpi-val">${won(shipA)}</div><div class="kpi-sub">M_제품 납품가(판매가 50%) × 수량 — 비교용</div></div>
    <div class="kpi"><div class="kpi-lbl">매장 폐기율</div><div class="kpi-val ${recv && waste / recv >= M.wasteWarn ? 'dn' : ''}">${recv ? fp(waste / recv) : '–'}</div><div class="kpi-sub">폐기 <b>${num(waste)}</b>개 ÷ 입고 ${num(recv)}개 · ${Object.keys(st).length}곳 기록</div></div>
    <div class="kpi"><div class="kpi-lbl">폐기 원가</div><div class="kpi-val">${won(wcost)}</div><div class="kpi-sub">판매 ${num(sold)}개 · 판매율 ${recv ? fp(sold / recv) : '–'}</div></div></div>`;
  const yms = uniq(Object.keys(K.ship).concat(Object.keys(K.st))).filter(x => x >= m.slice(0, 4) + '-01').sort();
  const sStores = STORES.filter(s => yms.some(x => K.ship[x] && K.ship[x][s]));
  const shipChart = colChart({cats: yms, labels: yms.map(x => mLab(x)), h: 220, fmt: v => num(v) + '개', unit: 'n', aria: '월별 베이커리 출고 수량',
    series: sStores.map(s => ({name: s, color: sc(s), values: yms.map(x => K.ship[x] && K.ship[x][s] ? K.ship[x][s].qty : null)})), hl: yms.indexOf(m),
    tipTitle: i => mLab(yms[i], true) + ' 출고 수량'});
  const wk = uniq(Object.keys(K.st)).sort().filter(x => x >= ymAdd(m, -14) && x <= m);
  const wm = wk.length ? monthsBetween(wk[0], wk[wk.length - 1]) : [];
  const wStores = STORES.filter(s => wm.some(x => K.st[x] && K.st[x][s]));
  const wl = lineChart({cats: wm, labels: mAxis(wm), h: 220, unit: 'pct', fmt: v => fp(v), band: [0, 0.15], bandLabel: '15% 미만', zero: true, aria: '월별 폐기율',
    series: wStores.map(s => ({name: s, color: sc(s), values: wm.map(x => { const o = K.st[x] && K.st[x][s]; return o && o.recv > 100 ? o.waste / o.recv : null; })}))});
  h += `<div class="g2e gap"><div class="card"><div class="card-title">월별 출고 수량 <small>연남 베이커리 → 지점</small></div>${shipChart}</div>
    <div class="card"><div class="card-title">폐기율 추이 <small>폐기 ÷ 입고 · 매장 베이커리 탭 기록이 있는 달만</small></div>${wl}</div></div>`;
  // 지점 표
  h += `<div class="sec-label">지점별 · ${mLab(m, true)}</div><div class="card"><div class="tbl-wrap"><table>
    <tr><th>지점</th><th class="n">중앙 출고</th><th class="n">매장 입고</th><th class="n">판매</th><th class="n">폐기</th><th class="n">폐기율</th><th class="n">판매율</th><th class="n">폐기 원가</th><th class="n">베이커리 매출 (추정)</th></tr>
    ${STORES.filter(s => ship[s] || st[s]).map(s => { const a = ship[s], b = st[s]; const wr = b && b.recv ? b.waste / b.recv : null;
      return `<tr><td>${dot(s)}${s}</td><td class="n">${a ? num(a.qty) : '–'}</td><td class="n">${b ? num(b.recv) : '<span class="muted">기록 없음</span>'}</td><td class="n">${b ? num(b.sold) : '–'}</td><td class="n">${b ? num(b.waste) : '–'}</td>
      <td class="n ${wr >= M.wasteWarn ? 'dn' : ''}">${fp(wr)} ${isNum(wr) ? (wr >= M.wasteWarn ? '<span class="badge bad">높음</span>' : wr >= .15 ? '<span class="badge warn">주의</span>' : '') : ''}</td>
      <td class="n">${b && b.recv ? fp(b.sold / b.recv) : '–'}</td><td class="n">${b ? won(b.wcost) : '–'}</td><td class="n">${b ? won(b.sales) : '–'}</td></tr>`; }).join('')}
  </table></div><div class="note">매장 입고·판매·폐기는 ${TNF('bk_store')} 기준. 판매 = 전일재고 + 입고 − 폐기 − 당일재고로 다시 계산했습니다(원본 수식은 이월 재고를 빼지 않아 판매가 과대). 폐기 원가 = 폐기 수량 × 직영원가, 추정 매출 = 판매 × 판매가(VAT 포함). 리뷰 쿠키(증정)는 폐기율에서 뺐습니다.</div></div>`;
  // 제품 표
  const pm = K.pm[m] || {};
  let prows = Object.entries(pm).map(([code, q]) => { const p = K.prod[code] || {}; return {code, p, q, wr: q.recv ? q.waste / q.recv : null}; });
  const qq = UI.prodQ.trim().replace(/\s+/g, '');
  if (qq) prows = prows.filter(x => ((x.p.name || '') + (x.p.cat || '') + x.code).replace(/\s+/g, '').includes(qq));
  prows.sort(UI.prodSort === 'waste' ? (a, b) => nz(b.q.waste) - nz(a.q.waste) : (a, b) => nz(b.q.ship) - nz(a.q.ship));
  const lim = UI.prodMore ? prows.length : 25;
  h += `<div class="sec-label">제품별 · ${mLab(m)}</div><div class="card"><div class="filters"><input class="search" id="prodQ" placeholder="제품명·분류·코드 검색" value="${esc(UI.prodQ)}">
    <div class="seg"><button data-psort="ship" class="${UI.prodSort === 'ship' ? 'on' : ''}">출고순</button><button data-psort="waste" class="${UI.prodSort === 'waste' ? 'on' : ''}">폐기 많은 순</button></div>
    <span class="muted" style="font-size:11.5px">${prows.length}개 제품</span></div>
    <div class="tbl-wrap"><table><tr><th>제품</th><th>분류</th><th class="n">출고</th><th class="n">매장 입고</th><th class="n">판매</th><th class="n">폐기</th><th class="n">폐기율</th><th class="n">원가</th><th class="n">판매가</th><th class="n">원가율</th></tr>
    ${prows.slice(0, lim).map(x => { const cr = x.p.cost && x.p.price ? x.p.cost / (x.p.price / 1.1) : null;
      return `<tr><td><b>${esc(x.p.name || x.code)}</b><span class="sm">${esc(x.code)}</span></td><td class="muted">${esc(x.p.cat || '')}</td><td class="n">${num(x.q.ship)}</td><td class="n">${x.q.recv ? num(x.q.recv) : '–'}</td><td class="n">${x.q.recv ? num(x.q.sold) : '–'}</td><td class="n">${x.q.recv ? num(x.q.waste) : '–'}</td>
      <td class="n ${x.wr >= M.wasteWarn ? 'dn' : ''}">${fp(x.wr)}</td><td class="n">${x.p.cost ? num(Math.round(x.p.cost)) : '<span class="badge warn">미정</span>'}</td><td class="n">${x.p.price ? num(x.p.price) : '–'}</td><td class="n">${fp(cr)}</td></tr>`; }).join('')}
    </table></div>${prows.length > 25 ? `<div style="margin-top:10px"><button class="chip" id="prodMore">${UI.prodMore ? '접기' : `전체 ${prows.length}개 보기`}</button></div>` : ''}
    <div class="note">원가율 = 원가 ÷ (판매가 ÷ 1.1). 원가가 '미정'인 제품과 출처마다 값이 다른 제품(M_제품 비고)은 본사가 한 번 확정해야 폐기 원가가 정확해집니다.</div></div>`;
  $('#tab-bakery').innerHTML = h;
  const q = $('#prodQ');
  if (q) { q.addEventListener('input', () => { UI.prodQ = q.value; const pos = q.selectionStart; renderBakery(); const q2 = $('#prodQ'); q2.focus(); q2.setSelectionRange(pos, pos); chartEvents($('#tab-bakery')); }); }
}

/* ═════════ 원두·메뉴 ═════════ */
function renderBeans() {
  const m = UI.m, B = M.B;
  const cur = B.m[m] || {}, prev = B.m[ymAdd(m, -1)] || {};
  const kg = sum(Object.values(cur), o => o.kg), amt = sum(Object.values(cur), o => o.amt);
  const dirKg = sum(Object.values(cur).filter(o => o.ctype === '직영'), o => o.kg);
  const pkg = sum(Object.values(prev), o => o.kg);
  const lastBasis = uniq(M.menu.map(r => r.from)).sort().pop();
  const mc = M.menu.filter(r => r.from === lastBasis && r.price);
  const avgCr = mc.length ? sum(mc, r => r.cost / r.price) / mc.length : null;
  let h = `<div class="g4">
    <div class="kpi"><div class="kpi-lbl">${mLab(m)} 원두 발주</div><div class="kpi-val">${num(kg, 1)}<small>kg</small></div><div class="kpi-sub">전월 ${num(pkg, 1)}kg · <span class="${deltaCls(ratio(kg, pkg) - 1)}">${fpp(ratio(kg, pkg) - 1)}</span></div></div>
    <div class="kpi"><div class="kpi-lbl">발주 금액</div><div class="kpi-val">${won(amt)}</div><div class="kpi-sub">수량 × 거래처유형별 단가${sum(Object.values(cur), o => o.noPrice) ? ` · 단가 없는 줄 ${sum(Object.values(cur), o => o.noPrice)}` : ''}</div></div>
    <div class="kpi"><div class="kpi-lbl">직영 비중</div><div class="kpi-val">${fp(ratio(dirKg, kg), 0)}</div><div class="kpi-sub">직영 ${num(dirKg, 1)}kg · 외부(신사·DMC 등) ${num(kg - dirKg, 1)}kg</div></div>
    <div class="kpi"><div class="kpi-lbl">음료 평균 원가율</div><div class="kpi-val">${fp(avgCr)}</div><div class="kpi-sub">${lastBasis ? dLab(lastBasis) + ' 기준' : ''} · ${mc.length}개 메뉴 단순평균(매장)</div></div></div>`;
  const all = Object.keys(B.m).sort();
  const custs = [...B.custs].sort((a, b) => sOrd(a) - sOrd(b));
  const bc = colChart({cats: all, labels: mAxis(all), h: 240, fmt: v => num(v, 1) + 'kg', unit: 'n', aria: '월별 원두 발주량',
    series: custs.map(c => ({name: c, color: sc(c), values: all.map(x => B.m[x][c] ? B.m[x][c].kg : null)})), hl: all.indexOf(m),
    tipTitle: i => mLab(all[i], true) + ' 원두 발주'});
  h += `<div class="sec-label">원두 발주 추이 · 합정 로스터리</div><div class="card"><div class="card-title">월별 발주량 <small>${mLab(all[0], true)}~${mLab(all[all.length - 1], true)} · 거래처별 kg (주차 시작일 기준 월)</small></div>${bc}</div>`;
  const rows = Object.entries(cur).sort((a, b) => b[1].kg - a[1].kg);
  h += `<div class="g2 gap"><div class="card"><div class="card-title">거래처별 · ${mLab(m)}</div><div class="tbl-wrap"><table>
    <tr><th>거래처</th><th>유형</th><th class="n">봉</th><th class="n">kg</th><th class="n">금액</th><th class="n">kg당</th><th class="n">전월 kg</th></tr>
    ${rows.map(([c, o]) => `<tr><td>${dot(c)}${esc(c)}</td><td class="muted">${esc(o.ctype || '')}</td><td class="n">${num(o.qty)}</td><td class="n">${num(o.kg, 1)}</td><td class="n">${o.amt ? won(o.amt) : '–'}</td><td class="n">${o.amt && o.kg ? num(Math.round(o.amt / o.kg)) : '–'}</td><td class="n">${prev[c] ? num(prev[c].kg, 1) : '–'}</td></tr>`).join('')}
    <tr class="tot"><td>합계</td><td></td><td class="n">${num(sum(rows, r => r[1].qty))}</td><td class="n">${num(kg, 1)}</td><td class="n">${won(amt)}</td><td></td><td class="n">${num(pkg, 1)}</td></tr></table></div></div>
    <div class="card"><div class="card-title">원두 단가 <small>M_원두단가 · 원</small></div>${(() => {
      const ct = uniq(M.beanPrice.map(r => r.ctype)), keys = uniq(M.beanPrice.map(r => r.prod + '|' + r.unit));
      const pv = {}; M.beanPrice.forEach(r => pv[r.prod + '|' + r.unit + '|' + r.ctype] = r.price);
      return `<div class="tbl-wrap"><table><tr><th>품목</th><th>규격</th>${ct.map(c => `<th class="n">${esc(c)}</th>`).join('')}</tr>
      ${keys.map(k => { const [p, u] = k.split('|'); return `<tr><td>${esc(p)}</td><td class="muted">${esc(u)}</td>${ct.map(c => `<td class="n">${isNum(pv[k + '|' + c]) ? num(pv[k + '|' + c]) : '<span class="muted">·</span>'}</td>`).join('')}</tr>`; }).join('')}</table></div>`; })()}
    <div class="note">직영 22,000원 / 신사·DMC 33,000~39,900원 / 마곡은 3월까지 45,000원대 → 4월 직영가로 전환. 원두 금액은 발주 수량 × 이 단가로 계산합니다(발주 시트에는 금액이 없었음).</div></div></div>`;
  // 메뉴 원가
  const bases = uniq(M.menu.map(r => r.from)).sort();
  const prevBasis = bases.length > 1 ? bases[bases.length - 2] : null;
  const pmap = {}; M.menu.filter(r => r.from === prevBasis).forEach(r => pmap[r.cat + '|' + r.menu + '|' + r.opt] = r);
  const mrows = mc.slice().sort((a, b) => b.cost / b.price - a.cost / a.price);
  h += `<div class="sec-label">음료 메뉴 원가 · ${lastBasis ? dLab(lastBasis) + ' 기준' : ''}</div><div class="card"><div class="tbl-wrap"><table>
    <tr><th>분류</th><th>메뉴</th><th>옵션</th><th class="n">판매가</th><th class="n">원가 (매장)</th><th class="n">원가율</th><th class="n">원가 (포장)</th><th class="n">포장 원가율</th><th class="n">${prevBasis ? dLab(prevBasis) + ' 대비' : '변동'}</th></tr>
    ${mrows.map(r => { const cr = r.cost / r.price, ct = r.cost_to ? r.cost_to / r.price : null; const p = pmap[r.cat + '|' + r.menu + '|' + r.opt]; const dc = p ? r.cost - p.cost : null;
      return `<tr><td class="muted">${esc(r.cat)}</td><td><b>${esc(r.menu)}</b>${r.memo ? ` <span class="badge warn" title="${esc(r.memo)}">원본 수식 오류</span>` : ''}</td><td class="muted">${esc(r.opt || '')}</td><td class="n">${num(r.price)}</td><td class="n">${num(Math.round(r.cost))}</td>
      <td class="n ${cr >= .25 ? 'dn' : ''}">${fp(cr)}</td><td class="n">${r.cost_to ? num(Math.round(r.cost_to)) : '–'}</td><td class="n ${ct >= .3 ? 'dn' : ''}">${fp(ct)}</td><td class="n ${dc > 0 ? 'dn' : dc < 0 ? 'up' : ''}">${isNum(dc) && Math.abs(dc) >= 1 ? sign(Math.round(dc), num) + '원' : '–'}</td></tr>`; }).join('')}
  </table></div><div class="note">원가율 = 원가 ÷ 판매가(VAT 포함, 원본 시트 방식). 콜드브루·아인슈페너는 원본 템플릿 평균식 오류로 원가가 약 1/3로 잡혀 있어 다시 계산했고, 티 ICE 포장 원가는 컵이 두 번 들어가 있던 것을 바로잡았습니다(비고 참고).</div></div>`;
  $('#tab-beans').innerHTML = h;
}

/* ═════════ 재고·비용 ═════════ */
function renderCost() {
  const m = UI.m, I = M.I;
  const invMonths = uniq([].concat(...Object.values(I.sm).map(o => Object.keys(o)))).sort();
  const im = invMonths.filter(x => x <= m).pop() || null;
  const ipm = im ? ymAdd(im, -1) : null;
  const invS = im ? [...STORES, ...FACILITIES].filter(s => I.sm[s] && I.sm[s][im]) : [];
  const it = invS.map(s => ({s, o: I.sm[s][im], p: I.sm[s][ipm]}));
  const ca = sum(it, x => x.o.ca), ua = sum(it, x => x.o.ua);
  const cards = STORES.concat(FACILITIES).filter(s => M.C.sm[s] && M.C.sm[s][m]);
  const cardAmt = sum(cards, s => M.C.sm[s][m].amt);
  let h = `<div class="g4">
    <div class="kpi"><div class="kpi-lbl">${mLab(im || m)} 기말 재고</div><div class="kpi-val">${it.length ? won(ca) : '–'}</div><div class="kpi-sub">${it.length ? `${it.length}곳 · 월말 실사 기준${im !== m ? ` · <b>${mLab(m)}분은 익월 3일까지</b>` : ''}` : '재고수불 미입력'}</div></div>
    <div class="kpi"><div class="kpi-lbl">사용 금액 (재료비)</div><div class="kpi-val">${it.length ? won(ua) : '–'}</div><div class="kpi-sub">기초 + 입고 − 기말</div></div>
    <div class="kpi"><div class="kpi-lbl">재고 일수</div><div class="kpi-val">${ua ? num(ca / ua * dim(im), 1) : '–'}<small>일</small></div><div class="kpi-sub">기말 재고 ÷ 일평균 사용</div></div>
    <div class="kpi"><div class="kpi-lbl">법인카드 사용</div><div class="kpi-val">${won(cardAmt)}</div><div class="kpi-sub">${cards.length}곳 기록 · ${sum(cards, s => M.C.sm[s][m].n)}건</div></div></div>`;
  // 재고 표
  h += `<div class="sec-label">재고수불 · ${mLab(im || m, true)}</div><div class="card">${im && im !== m ? `<div class="notice info" style="margin-bottom:10px"><div>ⓘ</div><div>${mLab(m)} 재고수불은 월말 실사 후 익월 3일까지 입력하므로, 가장 최근에 마감된 <b>${mLab(im, true)}</b>을 보여줍니다.</div></div>` : ''}${it.length ? `<div class="tbl-wrap"><table>
    <tr><th>지점</th><th class="n">기초</th><th class="n">입고</th><th class="n">사용</th><th class="n">기말</th><th class="n">재고 일수</th><th class="n">품목</th><th class="n">기초 − 전월 기말</th></tr>
    ${it.map(x => { const gap = x.p ? x.o.oa - x.p.ca : null;
      return `<tr><td>${dot(x.s)}${x.s}</td><td class="n">${won(x.o.oa)}</td><td class="n">${won(x.o.ia)}</td><td class="n">${won(x.o.ua)}</td><td class="n"><b>${won(x.o.ca)}</b></td><td class="n">${x.o.ua ? num(x.o.ca / x.o.ua * dim(im), 1) + '일' : '–'}</td><td class="n">${num(x.o.n)}</td>
      <td class="n ${isNum(gap) && Math.abs(gap) > 50000 ? 'dn' : ''}">${isNum(gap) ? sign(gap) : '–'}</td></tr>`; }).join('')}
  </table></div><div class="note">'기초 − 전월 기말'이 0이 아니면 기초 수량·단가를 손으로 다시 옮겨 적다가 어긋난 것입니다. 새 ${TNF('inv')}에서는 기초를 전월 기말에서 그대로 가져오세요. 원두(합정 로스터리 이관분)는 지점 시트에 수량만 있고, 금액은 ${esc(TNF('inv_price'))}의 단가로 계산합니다.</div>
  ${I.noPrice ? `<div class="notice" style="margin:10px 0 0"><div>!</div><div><b>원두 재고 ${num(I.noPrice)}행은 단가를 찾지 못해 금액 0으로 계산됐습니다.</b> ${esc(TNF('inv_price'))}에 같은 지점·품목명(띄어쓰기까지)이 있는지 확인하세요.</div></div>` : ''}` : `<div class="empty">재고수불 데이터가 없습니다</div>`}</div>`;
  // 분류별 사용
  if (it.length) {
    const cat = {};
    it.forEach(x => { for (const [c, v] of Object.entries(x.o.cat)) cat[c] = (cat[c] || 0) + v.ua; });
    const cr = Object.entries(cat).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([l, v]) => ({l, v, sub: fp(ratio(v, ua), 0)}));
    const top = [].concat(...it.map(x => x.o.items.map(r => ({...r, s: x.s})))).sort((a, b) => nz(b.ca) - nz(a.ca)).slice(0, 12);
    h += `<div class="g2e gap"><div class="card"><div class="card-title">분류별 사용 금액 <small>${it.length}곳 합</small></div>${hbars(cr)}</div>
      <div class="card"><div class="card-title">기말 재고 상위 품목</div><div class="tbl-wrap"><table><tr><th>품목</th><th>지점</th><th class="n">수량</th><th class="n">금액</th></tr>
      ${top.map(r => `<tr><td>${esc(r.item)}<span class="sm">${esc(r.cat || '')}</span></td><td>${dot(r.s)}${r.s}</td><td class="n">${num(r.cq, 1)} <span class="muted">${esc((r.unit || '').split('/')[0])}</span></td><td class="n">${won(r.ca)}</td></tr>`).join('')}</table></div></div></div>`;
  }
  // 법인카드
  const cats = uniq([].concat(...cards.map(s => Object.keys(M.C.sm[s][m].cat))));
  const catTot = {}; cards.forEach(s => { for (const [c, v] of Object.entries(M.C.sm[s][m].cat)) catTot[c] = (catTot[c] || 0) + v; });
  cats.sort((a, b) => catTot[b] - catTot[a]);
  const stops = STORES.concat(FACILITIES).filter(s => M.C.last[s]);
  h += `<div class="sec-label">법인카드 · ${mLab(m)}</div><div class="card">
    <div class="filters">${stops.map(s => { const late = M.C.last[s] < ymAdd(m, -1) + '-15';
      return `<span class="badge ${late ? 'warn' : 'neutral'}">${s} 마지막 기록 ${M.C.last[s].slice(2).replace(/-/g, '.')}</span>`; }).join('')}</div>
    ${cards.length ? `<div class="tbl-wrap"><table><tr><th>지점</th>${cats.map(c => `<th class="n">${esc(c)}</th>`).join('')}<th class="n">합계</th><th class="n">건수</th></tr>
    ${cards.map(s => { const o = M.C.sm[s][m]; return `<tr><td>${dot(s)}${s}</td>${cats.map(c => `<td class="n">${o.cat[c] ? won(o.cat[c]) : '<span class="muted">·</span>'}</td>`).join('')}<td class="n"><b>${won(o.amt)}</b></td><td class="n">${o.n}</td></tr>`; }).join('')}
    </table></div>` : '<div class="empty">이 달 기록된 카드 사용 내역이 없습니다</div>'}
    <div class="note">노란 표시는 전월 중순 이후 기록이 없는 곳 — 사용액 0원이 아니라 <b>미기록</b>입니다. 월말에 카드사 승인내역과 대조해 빠진 건을 채우세요.</div></div>`;
  // 비용 원장
  const LF = ['전체', '확정', '정기', '금액 미정', '귀속월 미정'];
  let lg = M.ledger.slice();
  if (UI.ledgerF === '확정') lg = lg.filter(r => r.conf === 'Y');
  if (UI.ledgerF === '정기') lg = lg.filter(r => r.rep === 'Y');
  if (UI.ledgerF === '금액 미정') lg = lg.filter(r => !isNum(r.amt));
  if (UI.ledgerF === '귀속월 미정') lg = lg.filter(r => !r.m);
  lg.sort((a, b) => (b.m || '9999') < (a.m || '9999') ? -1 : 1);
  const byMaj = {}; M.ledger.forEach(r => { if (isNum(r.amt) && r.type !== '취소') byMaj[r.major || '기타'] = (byMaj[r.major || '기타'] || 0) + r.amt; });
  h += `<div class="sec-label">비용 원장 · 계획</div><div class="g2"><div class="card">
    <div class="filters">${LF.map(f => `<button class="chip ${UI.ledgerF === f ? 'on' : ''}" data-lf="${f}">${f}</button>`).join('')}</div>
    <div class="tbl-wrap"><table><tr><th>귀속월</th><th>지점</th><th>대구분</th><th>상세</th><th class="n">금액</th><th>상태</th></tr>
    ${lg.map(r => `<tr><td class="muted" style="white-space:nowrap">${r.m ? mLab(r.m, true) : '<span class="badge warn">미정</span>'}</td><td style="white-space:nowrap">${STORES.includes(r.s) ? dot(r.s) : ''}${esc(r.s || '')}</td><td class="muted">${esc(r.major || '')}<span class="sm">${esc(r.minor || '')}</span></td>
      <td>${esc(r.detail || '')}${r.memo ? `<span class="sm">${esc(r.memo)}</span>` : ''}</td><td class="n">${isNum(r.amt) ? won(r.amt) : '<span class="badge warn">미정</span>'}</td>
      <td style="white-space:nowrap">${r.type === '취소' ? '<span class="badge neutral">취소</span>' : r.type === '지급' ? '<span class="badge good">지급</span>' : r.conf === 'Y' ? '<span class="badge acc">확정</span>' : '<span class="badge info">계획</span>'}${r.rep === 'Y' ? ' <span class="badge neutral">정기</span>' : ''}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">해당 항목 없음</td></tr>'}
    </table></div></div>
    <div class="card"><div class="card-title">대구분별 계획 금액</div>${hbars(Object.entries(byMaj).sort((a, b) => b[1] - a[1]).map(([l, v]) => ({l, v})))}
    <div class="note">'비용 제출 예상안' 월별 탭(6~9월)을 한 원장으로 합친 것입니다. 달마다 복사되던 이월 항목은 1건으로, 7월 생두 구매 3중 입력은 1건으로 정리했습니다. 앞으로는 ${TNF('ledger')} 한 탭에서 같은 행의 구분을 계획 → 지급으로 바꾸면 됩니다.</div></div></div>`;
  $('#tab-cost').innerHTML = h;
}

/* ═════════ 인력 ═════════ */
function renderStaff() {
  const m = UI.m, T = M.TO;
  const cnt = st => T.filter(r => st.includes(r.status)).length;
  const vac = T.filter(r => ['공석', '채용중', '오퍼진행'].includes(r.status));
  const basis = uniq(T.map(r => r.basis).filter(Boolean)).join(', ');
  let h = `<div class="g4">
    <div class="kpi"><div class="kpi-lbl">T.O 정원</div><div class="kpi-val">${T.length}<small>자리</small></div><div class="kpi-sub">기준 ${esc(basis || '–')}</div></div>
    <div class="kpi"><div class="kpi-lbl">재직</div><div class="kpi-val">${cnt(['재직', '퇴사예정'])}<small>명</small></div><div class="kpi-sub">퇴사 예정 <b>${cnt(['퇴사예정'])}</b></div></div>
    <div class="kpi"><div class="kpi-lbl">공석</div><div class="kpi-val ${vac.length ? 'dn' : ''}">${vac.length}<small>자리</small></div><div class="kpi-sub">${uniq(vac.map(r => r.s)).join(' · ') || '없음'}</div></div>
    <div class="kpi"><div class="kpi-lbl">입사 예정</div><div class="kpi-val">${cnt(['입사예정'])}<small>명</small></div><div class="kpi-sub">오퍼 진행 ${cnt(['오퍼진행'])}</div></div></div>`;
  const roles = ['파트장', '점장', '부점장', '매니저', '파티셰', 'PT평일', 'PT주말'];
  const allRoles = uniq(T.map(r => r.role));
  const rl = roles.filter(r => allRoles.includes(r)).concat(allRoles.filter(r => !roles.includes(r)));
  const sites = uniq(T.map(r => r.s)).sort((a, b) => sOrd(a) - sOrd(b));
  h += `<div class="sec-label">T.O 현황 <small style="font-weight:600;letter-spacing:0;text-transform:none">재직 / 정원</small></div><div class="card"><div class="tbl-wrap"><table>
    <tr><th>지점</th>${rl.map(r => `<th class="n">${esc(r)}</th>`).join('')}<th class="n">합계</th></tr>
    ${sites.map(s => { const rs = T.filter(r => r.s === s);
      return `<tr><td>${STORES.includes(s) ? dot(s) : ''}${esc(s)}</td>${rl.map(role => { const a = rs.filter(r => r.role === role); if (!a.length) return '<td class="n muted">·</td>';
        const f = a.filter(r => ['재직', '퇴사예정'].includes(r.status)).length, v = a.filter(r => ['공석', '채용중', '오퍼진행'].includes(r.status)).length;
        return `<td class="n ${v ? 'dn' : ''}">${f}/${a.length}${a.some(r => r.status === '퇴사예정') ? ' <span class="badge warn">퇴사예정</span>' : ''}${a.some(r => r.status === '입사예정') ? ' <span class="badge acc">입사예정</span>' : ''}</td>`; }).join('')}
      <td class="n"><b>${rs.filter(r => ['재직', '퇴사예정'].includes(r.status)).length}/${rs.length}</b></td></tr>`; }).join('')}
  </table></div>
  ${vac.length ? `<div class="note"><b>공석</b> — ${vac.map(r => `${esc(r.s)} ${esc(r.role)}${r.hours ? ` (${esc(r.hours)})` : ''}`).join(' · ')}</div>` : ''}
  <div class="note">이름 없이 자리 단위로만 셉니다. T.O 버전 표기(${esc(basis)})가 실제 수정일보다 오래돼 있으니 ${TNF('to')}의 기준일을 고칠 때마다 바꿔 주세요.</div></div>`;
  // 근무
  const sh = M.SH[m] || {};
  const shS = Object.keys(sh).sort((a, b) => sOrd(a) - sOrd(b));
  h += `<div class="sec-label">근무 · ${mLab(m, true)}</div><div class="card">${shS.length ? `<div class="tbl-wrap"><table>
    <tr><th>지점</th><th class="n">매니저 오픈</th><th class="n">마감</th><th class="n">미들·기타</th><th class="n">근무한 매니저</th><th class="n">지원받은 근무</th><th class="n">PT 인원</th><th class="n">PT 시간</th><th class="n">시간외</th><th class="n">인건비율 (손익)</th></tr>
    ${shS.map(s => { const r = sh[s], po = M.P.sm[s] && M.P.sm[s][m];
      return `<tr><td>${STORES.includes(s) ? dot(s) : ''}${esc(s)}</td><td class="n">${num(r.open)}</td><td class="n">${num(r.close)}</td><td class="n">${num(nz(r.mid) + nz(r.other))}</td><td class="n">${num(r.mgr)}</td><td class="n">${num(r.sup_in)}</td><td class="n">${num(r.pt)}</td><td class="n">${isNum(r.pth) ? num(r.pth) + 'h' : '–'}</td><td class="n">${isNum(r.ot) ? num(r.ot, 1) + 'h' : '–'}</td>
      <td class="n">${po && po.rev ? fp(po._labor / po.rev) : '–'}</td></tr>`; }).join('')}
  </table></div>` : `<div class="empty">이 달 근무 집계가 없습니다 (${TNF('shifts')})</div>`}
  <div class="note">매니저 근무는 통합 운영스케줄의 근무 코드(O·C·M)를, PT는 지점 스케줄의 배치 시간(휴게 미차감)을 센 값입니다. 통합 스케줄에 신사(3월 이후)·마곡(3~4월) 직원 행이 없어 그 달은 지점 탭 기준입니다.</div></div>`;
  const sk = uniq(Object.keys(M.SH)).sort().filter(x => x >= ymAdd(m, -12) && x <= m);
  const yms = sk.length ? monthsBetween(sk[0], sk[sk.length - 1]) : [];
  const ptS = STORES.filter(s => yms.some(x => M.SH[x] && M.SH[x][s] && isNum(M.SH[x][s].pth)));
  h += `<div class="card gap"><div class="card-title">PT 배치 시간 추이 <small>월별 · 휴게 미차감</small></div>${lineChart({cats: yms, labels: mAxis(yms), h: 220, unit: 'n', fmt: v => num(v) + 'h', aria: 'PT 시간 추이',
    series: ptS.map(s => ({name: s, color: sc(s), values: yms.map(x => M.SH[x] && M.SH[x][s] && isNum(M.SH[x][s].pth) ? M.SH[x][s].pth : null)}))})}</div>`;
  $('#tab-staff').innerHTML = h;
}

/* ═════════ 마케팅·리뷰 ═════════ */
function renderMkt() {
  const m = UI.m, R = M.R;
  const rs = STORES.filter(s => R.sm[s] && R.sm[s][m]);
  const tot = sum(rs, s => R.sm[s][m].total), neg = sum(rs, s => R.sm[s][m].neg), nav = sum(rs, s => R.sm[s][m].pf['네이버'] || 0);
  const promo = M.PROMO.filter(r => ymOf(r.d) === m);
  const ups = M.MK;
  let h = '';
  const stale = STORES.filter(s => R.last[s] && R.last[s] < m + '-01');
  if (stale.length) h += `<div class="notice"><div>ⓘ</div><div><b>리뷰 기록이 멈춘 지점이 있습니다.</b> ${stale.map(s => `${s} ${R.last[s].slice(2).replace(/-/g, '.')}`).join(' · ')} 이후 기록 없음. ${mLab(m)} 리뷰 수는 기록된 지점(${rs.join('·') || '없음'})만의 합입니다.</div></div>`;
  h += `<div class="g4">
    <div class="kpi"><div class="kpi-lbl">${mLab(m)} 리뷰</div><div class="kpi-val">${num(tot)}<small>건</small></div><div class="kpi-sub">${rs.length}곳 기록</div></div>
    <div class="kpi"><div class="kpi-lbl">네이버 비중</div><div class="kpi-val">${fp(ratio(nav, tot), 0)}</div><div class="kpi-sub">네이버 ${num(nav)}건</div></div>
    <div class="kpi"><div class="kpi-lbl">부정 리뷰</div><div class="kpi-val ${neg ? 'dn' : ''}">${num(neg)}<small>건</small></div><div class="kpi-sub">긍정·부정 분류는 4월 이후 입력이 거의 멈춤</div></div>
    <div class="kpi"><div class="kpi-lbl">프로모션 사용</div><div class="kpi-val">${num(sum(promo, r => r.qty))}<small>건</small></div><div class="kpi-sub">${uniq(promo.map(r => r.item)).length}종 · ${uniq(promo.map(r => r.s)).map(esc).join('·') || '기록 없음'}</div></div></div>`;
  const rk = uniq([].concat(...Object.values(R.sm).map(o => Object.keys(o)))).sort().filter(x => x <= m);
  const yms = rk.length ? monthsBetween(rk[0], rk[rk.length - 1]) : [];
  const rS = STORES.filter(s => R.sm[s]);
  h += `<div class="g2 gap"><div class="card"><div class="card-title">월별 리뷰 수 <small>전 플랫폼 합 · 기록이 있는 달만 선으로 이어짐</small></div>${lineChart({cats: yms, labels: mAxis(yms), h: 230, unit: 'n', fmt: v => num(v) + '건', aria: '월별 리뷰 수',
    series: rS.map(s => ({name: s, color: sc(s), values: yms.map(x => R.sm[s][x] ? R.sm[s][x].total : null)}))})}</div>
    <div class="card"><div class="card-title">플랫폼별 · ${mLab(m)}</div>${rs.length ? (() => { const pfs = uniq([].concat(...rs.map(s => Object.keys(R.sm[s][m].pf))));
      return `<div class="tbl-wrap"><table><tr><th>지점</th>${pfs.map(p => `<th class="n">${esc(p)}</th>`).join('')}<th class="n">합계</th></tr>${rs.map(s => `<tr><td>${dot(s)}${esc(s)}</td>${pfs.map(p => `<td class="n">${num(R.sm[s][m].pf[p] || 0)}</td>`).join('')}<td class="n"><b>${num(R.sm[s][m].total)}</b></td></tr>`).join('')}</table></div>`; })() : '<div class="empty">이 달 리뷰 기록 없음</div>'}</div></div>`;
  if (promo.length) {
    const items = uniq(promo.map(r => r.item)), ps = uniq(promo.map(r => r.s)).sort((a, b) => sOrd(a) - sOrd(b));
    h += `<div class="sec-label">프로모션 사용 · ${mLab(m)}</div><div class="card"><div class="tbl-wrap"><table><tr><th>프로모션</th>${ps.map(s => `<th class="n">${dot(s)}${esc(s)}</th>`).join('')}</tr>
      ${items.map(it => `<tr><td>${esc(it)}</td>${ps.map(s => `<td class="n">${num(sum(promo.filter(r => r.item === it && r.s === s), r => r.qty)) || '·'}</td>`).join('')}</tr>`).join('')}</table></div></div>`;
  }
  const upM = ups.filter(r => ymOf(r.d) === m);
  const upShow = upM.length ? upM : ups;
  const ag = groupBy(upShow, r => r.ch || '기타');
  h += `<div class="sec-label">대행사 집행 · ${upM.length ? mLab(m) : '전체 기록'} ${upShow.length}건</div><div class="card">
    ${upM.length ? '' : `<div class="note" style="margin:0 0 10px">${mLab(m)}에는 기록이 없어 파일에 있는 전체 기간(${uniq(ups.map(r => ymOf(r.d))).sort().map(x => mLab(x)).join('·')})을 보여줍니다.</div>`}
    <div class="tbl-wrap"><table><tr><th>대행사</th><th>기간</th><th class="n">업로드</th><th class="n">체험단 방문</th><th>지점별</th><th class="n">평균 팔로워</th></tr>
    ${Object.entries(ag).sort((a, b) => b[1].length - a[1].length).map(([c, a]) => { const ds = a.map(r => r.d).sort(); const fol = a.filter(r => isNum(r.fol));
      const bs = groupBy(a.filter(r => r.s), r => r.s);
      return `<tr><td><b>${esc(c)}</b></td><td class="muted" style="white-space:nowrap">${dLab(ds[0])}~${dLab(ds[ds.length - 1])}</td><td class="n">${a.filter(r => r.kind === '인플루언서업로드').length}</td><td class="n">${a.filter(r => r.kind === '체험단방문').length}</td>
        <td style="white-space:normal">${Object.entries(bs).sort((x, y) => sOrd(x[0]) - sOrd(y[0])).map(([s2, b]) => `${dot(s2)}${esc(s2)} ${b.length}`).join('&nbsp;&nbsp;')}</td><td class="n">${fol.length ? won(sum(fol, r => r.fol) / fol.length).replace('원', '') : '–'}</td></tr>`; }).join('')}
    </table></div>
    <details class="cols" style="margin-top:12px"><summary>집행 목록 ${upShow.length}건 <small>날짜·계정·그날 지점 매출</small></summary><div class="in"><div class="tbl-wrap"><table><tr><th>날짜</th><th>지점</th><th>대행사</th><th>유형</th><th>계정</th><th class="n">팔로워</th><th class="n">그날 매출</th><th>메모</th></tr>
    ${upShow.slice().sort((a, b) => a.d < b.d ? -1 : 1).map(r => { const sd = r.s && M.S.sd[r.s] && M.S.sd[r.s][r.d];
      return `<tr><td class="muted" style="white-space:nowrap">${dLab(r.d)}</td><td style="white-space:nowrap">${r.s ? dot(r.s) + esc(r.s) : '–'}</td><td>${esc(r.ch || '')}</td><td class="muted">${esc(r.kind || '')}</td><td>${esc(r.item || '')}</td><td class="n">${r.fol ? won(r.fol).replace('원', '') : '–'}</td><td class="n">${sd ? won(sd._tot) : '–'}</td><td class="muted" style="font-size:11.5px;white-space:normal;min-width:180px">${esc(r.memo || '')}</td></tr>`; }).join('')}
    </table></div></div></details>
    <div class="note">집행 비용·게시물 링크가 기록돼 있지 않아 성과(ROI)는 계산할 수 없습니다. ${TNF('mkt')}에 비용과 링크를 함께 적으면 일매출과 연결해 비교할 수 있습니다.</div></div>`;
  $('#tab-mkt').innerHTML = h;
}

/* ═════════ 출점 ═════════ */
const ACTIVE_STAGES = ['연락중', '상담완료', '유망', '미팅', '협상'];
const SPRI = {'계약': 0, '협상': 1, '미팅': 2, '유망': 3, '상담완료': 4, '연락중': 5, '신규': 6, '오픈': 7, '드롭': 8};
function renderExpand() {
  const L = M.L;
  const stages = ['신규', '연락중', '상담완료', '유망', '미팅', '협상', '계약', '오픈', '드롭'];
  const cnt = s => L.filter(r => r.stage === s).length;
  const KORD = ['입점', '파트너', '강남점투자', '미팅희망'];
  const kinds = KORD.filter(k => L.some(r => r.kind === k)).concat(uniq(L.map(r => r.kind).filter(k => k && !KORD.includes(k))));
  let rows = L.slice();
  if (UI.leadStage) rows = rows.filter(r => r.stage === UI.leadStage);
  if (UI.leadKind !== '전체') rows = rows.filter(r => r.kind === UI.leadKind);
  const q = UI.leadQ.trim();
  if (q) rows = rows.filter(r => [r.region, r.addr, r.terms, r.memo, r.sido, r.id].join(' ').includes(q));
  const maxC = Math.max(...stages.map(cnt), 1);
  let h = `<div class="g4">
    <div class="kpi"><div class="kpi-lbl">전체 리드</div><div class="kpi-val">${L.length}<small>건</small></div><div class="kpi-sub">${kinds.map(k => `${esc(k)} ${L.filter(r => r.kind === k).length}`).join(' · ')}</div></div>
    <div class="kpi"><div class="kpi-lbl">진행 중</div><div class="kpi-val">${L.filter(r => ACTIVE_STAGES.includes(r.stage)).length}<small>건</small></div><div class="kpi-sub">연락중~협상</div></div>
    <div class="kpi"><div class="kpi-lbl">미팅 이상</div><div class="kpi-val">${L.filter(r => ['미팅', '협상', '계약', '오픈'].includes(r.stage)).length}<small>건</small></div><div class="kpi-sub">유망 ${cnt('유망')} · 상담완료 ${cnt('상담완료')}</div></div>
    <div class="kpi"><div class="kpi-lbl">드롭</div><div class="kpi-val">${cnt('드롭')}<small>건</small></div><div class="kpi-sub">사유 기록 필요</div></div></div>`;
  h += `<div class="sec-label">단계 <small style="font-weight:600;letter-spacing:0;text-transform:none">누르면 아래 목록이 걸러집니다</small></div>
    <div class="funnel">${stages.map(s => `<button class="fs ${UI.leadStage === s ? 'on' : ''} ${s === '드롭' ? 'drop' : ''}" data-stage="${s}"><b>${cnt(s)}</b><span>${s}</span><i style="width:${cnt(s) / maxC * 100}%"></i></button>`).join('')}</div>`;
  const ms = uniq(L.map(r => r.m).filter(Boolean)).sort();
  const KC = ['#3A5BD9', '#EB6834', '#1BAF7A', '#EDA100'];
  const mc = colChart({cats: ms, labels: ms.map(x => mLab(x, true)), h: 200, unit: 'n', fmt: v => num(v) + '건', aria: '월별 리드 접수',
    series: kinds.map((k, i) => ({name: k, color: KC[i % 4], values: ms.map(x => L.filter(r => r.m === x && r.kind === k).length)}))});
  const sido = Object.entries(groupBy(L, r => r.sido || '미상')).map(([k, a]) => ({l: k, v: a.length})).sort((a, b) => b.v - a.v).slice(0, 10);
  h += `<div class="g2e gap"><div class="card"><div class="card-title">월별 접수 <small>Meta 리드 광고 폼 기준</small></div>${mc}</div>
    <div class="card"><div class="card-title">지역 <small>시·도 상위 10</small></div>${hbars(sido, {fmt: v => v + '건'})}</div></div>`;
  h += `<div class="sec-label">리드 목록 · ${rows.length}건</div><div class="card"><div class="filters">
    ${['전체'].concat(kinds).map(k => `<button class="chip ${UI.leadKind === k ? 'on' : ''}" data-kind="${esc(k)}">${esc(k)}</button>`).join('')}
    <input class="search" id="leadQ" placeholder="지역·주소·조건 검색" value="${esc(UI.leadQ)}">${UI.leadStage ? `<button class="chip on" data-stage="${UI.leadStage}">${UI.leadStage} ✕</button>` : ''}</div>
    <div class="tbl-wrap"><table><tr><th>ID</th><th>접수</th><th>유형</th><th>지역</th><th>층·면적</th><th>조건</th><th>단계</th><th>메모</th></tr>
    ${rows.sort((a, b) => (SPRI[a.stage] ?? 9) - (SPRI[b.stage] ?? 9) || ((b.d || b.m || '') < (a.d || a.m || '') ? -1 : 1)).slice(0, UI.leadMore ? rows.length : 30).map(r => `<tr><td class="muted">${esc(r.id)}</td><td class="muted" style="white-space:nowrap">${r.d ? dLab(r.d) : r.m ? mLab(r.m) : '–'}</td><td style="white-space:nowrap">${esc(r.kind || '')}</td>
      <td>${esc(r.region || '')}${r.addr ? `<span class="sm">${esc(r.addr)}</span>` : ''}</td><td style="white-space:nowrap">${esc(r.floor || '')}${r.py ? `<span class="sm">${num(r.py, 1)}평</span>` : ''}</td>
      <td style="font-size:11.5px;color:var(--ink2);min-width:220px;max-width:320px;white-space:normal">${esc(r.terms || '')}</td><td style="white-space:nowrap">${stageBadge(r.stage)}</td><td style="font-size:11.5px;color:var(--ink2);max-width:280px;white-space:normal">${esc(r.memo || '')}</td></tr>`).join('')}
    </table></div>${rows.length > 30 ? `<div style="margin-top:10px"><button class="chip" id="leadMore">${UI.leadMore ? '접기' : `전체 ${rows.length}건 보기`}</button></div>` : ''}<div class="note">진행 단계가 앞선 건(협상·미팅·유망)부터, 같은 단계는 최근 접수 순. 문의자 이름·연락처는 넣지 않았습니다(원본 Meta 리드 시트에만). 단계는 원본 셀 색을 읽어 추정한 값이 섞여 있어(드롭 28건 중 18건) 담당자가 한 번 확인해 주세요.</div></div>`;
  $('#tab-expand').innerHTML = h;
  const lq = $('#leadQ');
  if (lq) lq.addEventListener('input', () => { UI.leadQ = lq.value; const p = lq.selectionStart; renderExpand(); const l2 = $('#leadQ'); l2.focus(); l2.setSelectionRange(p, p); chartEvents($('#tab-expand')); });
}
function stageBadge(s) {
  const c = s === '드롭' ? 'neutral' : ['미팅', '협상', '계약', '오픈'].includes(s) ? 'good' : s === '유망' ? 'acc' : s === '신규' ? 'warn' : 'info';
  return `<span class="badge ${c}">${esc(s || '–')}</span>`;
}

/* ═══════════════════════════════════════════════
   배포판(GitHub) 전용 — 설정 암호화 · 초기 설정 화면 · 잠금 · 앱 설치
   index.html은 공개 저장소에 올라가므로 시트 주소를 평문으로 두지 않습니다.
   초기 설정 화면(주소 뒤 #setup)에서 두 시트 주소를 비밀번호로 암호화한 한 줄(config.js)을 만들고,
   대시보드는 비밀번호를 받은 뒤에야 그 줄을 풀어 시트를 읽습니다.
   → 대시보드 주소나 소스가 새어도 비밀번호 없이는 본사 시트 주소를 알 수 없음
   ═══════════════════════════════════════════════ */
const KDF_ITER = 310000;
const U8_ENC = new TextEncoder(), U8_DEC = new TextDecoder();
const b64uEnc = u8 => { let s = ''; for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
const b64uDec = s => { s = String(s).replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return Uint8Array.from(atob(s), c => c.charCodeAt(0)); };
const cryptoOK = () => !!(window.crypto && window.crypto.subtle) && window.isSecureContext !== false;

async function kdfKey(pw, salt, iter) {
  const base = await crypto.subtle.importKey('raw', U8_ENC.encode(pw), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256'}, base, {name: 'AES-GCM', length: 256}, false, ['encrypt', 'decrypt']);
}
async function encryptCfg(obj, pw) {
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await kdfKey(pw, salt, KDF_ITER);
  const ct = new Uint8Array(await crypto.subtle.encrypt({name: 'AES-GCM', iv}, key, U8_ENC.encode(JSON.stringify(obj))));
  return ['c1', KDF_ITER, b64uEnc(salt), b64uEnc(iv), b64uEnc(ct)].join('.');
}
/* 비밀번호가 틀리면 null, 코드가 깨졌으면 예외 */
async function decryptCfg(enc, pw) {
  const p = String(enc || '').trim().split('.');
  if (p.length !== 5 || p[0] !== 'c1' || !(Number(p[1]) > 0)) throw new Error('config.js의 설정 한 줄이 잘렸거나 형식이 다릅니다 — 초기 설정(#setup)에서 다시 만드세요');
  const key = await kdfKey(pw, b64uDec(p[2]), Number(p[1]));
  try { return JSON.parse(U8_DEC.decode(await crypto.subtle.decrypt({name: 'AES-GCM', iv: b64uDec(p[3])}, key, b64uDec(p[4])))); }
  catch (e) { return null; }
}

/* ── 풀어 둔 설정 보관: '이 기기에서 기억하기'면 localStorage, 아니면 이 탭(sessionStorage)만 ── */
const CFG_ST = 'cafe-dash:cfg.';
const cfgTag = () => CFG_ST + String(CFG_ENC || '').slice(-16);
const webStores = () => { const a = []; try { a.push(window.sessionStorage); } catch (e) {} try { a.push(window.localStorage); } catch (e) {} return a; };
function cfgForget() {
  for (const st of webStores()) { try { for (let i = st.length - 1; i >= 0; i--) { const k = st.key(i); if (k && k.startsWith(CFG_ST)) st.removeItem(k); } } catch (e) {} }
}
function cfgRemember(c, persist) {
  cfgForget();
  try { (persist ? window.localStorage : window.sessionStorage).setItem(cfgTag(), JSON.stringify(c)); } catch (e) {}
}
function cfgRecall() {
  if (!String(CFG_ENC || '').trim()) return null;
  for (const st of webStores()) {
    try {
      for (let i = st.length - 1; i >= 0; i--) { const k = st.key(i); if (k && k.startsWith(CFG_ST) && k !== cfgTag()) st.removeItem(k); }  // 옛 코드로 풀어 둔 값은 지움
      const v = st.getItem(cfgTag()); if (v) return JSON.parse(v);
    } catch (e) {}
  }
  return null;
}
function applyCfg(c) {
  CFG.hqSheetId = String(c.hqSheetId || ''); CFG.storeSheetId = String(c.storeSheetId || '');
  CFG.hqGids = c.hqGids || {}; CFG.storeGids = c.storeGids || {};
}

/* ── 잠금 화면 (스냅샷판·배포판 공용) ── */
function showLock(tryPw) {
  $('#setup').hidden = true; $('#app').hidden = true; $('#lock').hidden = false;
  const f = $('#lockForm'), inp = $('#lockPw'), err = $('#lockErr'), btn = f.querySelector('.lk-btn');
  inp.value = ''; err.textContent = '';
  setTimeout(() => inp.focus(), 30);
  const adm = $('#lockSetup');
  if (adm) { adm.hidden = !!SNAPSHOT; adm.onclick = e => { e.preventDefault(); try { history.replaceState(null, '', '#setup'); } catch (x) {} showSetup(); }; }
  f.onsubmit = async e => {
    e.preventDefault();
    const pw = inp.value.trim();
    if (!pw) { inp.focus(); return; }
    const label = btn.textContent;
    btn.disabled = true; btn.textContent = '확인 중…'; err.textContent = '';
    let ok = false;
    try { ok = await tryPw(pw, !!($('#lockRem') || {}).checked); } catch (x) { err.textContent = x.message; }
    btn.disabled = false; btn.textContent = label;
    if (!ok && !err.textContent) { err.textContent = '비밀번호가 올바르지 않습니다'; inp.select(); }
  };
}
function showFatal(title, msg) {
  $('#lock').hidden = true; $('#app').hidden = true;
  const box = $('#setup'); box.hidden = false;
  box.innerHTML = `<div class="su"><div class="su-top"><img src="${esc(($('.brand img') || {}).src || '')}" alt="필름"><span>카페사업팀 · 카페 공명 대시보드</span></div>
    <div class="card su-card"><div class="su-h">${esc(title)}</div><div class="note" style="margin-top:0">${esc(msg)}</div></div></div>`;
}

/* ── 배포판 시작 ── */
async function initDeploy() {
  initInstall();
  window.addEventListener('hashchange', () => { if (/^#setup/.test(location.hash) && $('#setup').hidden) showSetup(); });
  if (/^#setup/.test(location.hash) || !String(CFG_ENC || '').trim()) { showSetup(); return; }
  if (!cryptoOK()) { showFatal('이 주소에서는 잠금을 풀 수 없습니다', 'https:// 로 시작하는 GitHub Pages 주소로 열어주세요. PC에 내려받은 파일을 바로 열면 브라우저가 암호 기능을 막습니다.'); return; }
  const saved = cfgRecall();
  if (saved && (saved.hqSheetId || saved.storeSheetId)) { applyCfg(saved); startApp(); return; }
  showLock(async (pw, persist) => {
    const c = await decryptCfg(CFG_ENC, pw);
    if (!c) return false;
    cfgRemember(c, persist); applyCfg(c); startApp();
    return true;
  });
}
function lockNow() {
  if (SNAPSHOT) { lsSet('unlock', ''); initSnapshot(); return; }
  cfgForget();
  location.reload();
}

/* ── 초기 설정 화면 ── */
const sheetIdOf = v => { const s = String(v || '').trim(); const m = s.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]{20,})/) || s.match(/^([a-zA-Z0-9_-]{30,})$/); return m ? m[1] : ''; };
const gidOf = v => { const s = String(v || '').trim(); const m = s.match(/[#&?]gid=(\d+)/) || s.match(/^(\d+)$/); return m ? m[1] : ''; };
const SU_FILES = [['store', '지점 입력 시트', 'storeSheetId', 'storeGids', 'su_store'], ['hq', '본사 시트', 'hqSheetId', 'hqGids', 'su_hq']];

function showSetup() {
  $('#lock').hidden = true; $('#app').hidden = true;
  const box = $('#setup'); box.hidden = false;
  window.scrollTo({top: 0});
  const cur = cfgRecall() || (CFG.hqSheetId || CFG.storeSheetId ? CFG : {});
  const sheetUrl = id => id ? `https://docs.google.com/spreadsheets/d/${id}/edit` : '';
  const tabUrl = (id, g) => id && hasGid(g) ? `https://docs.google.com/spreadsheets/d/${id}/edit#gid=${g}` : '';
  const logo = ($('.brand img') || {}).src || '';
  box.innerHTML = `<div class="su">
    <div class="su-top"><img src="${esc(logo)}" alt="필름"><span>카페사업팀 · 카페 공명 대시보드</span></div>
    <h1>초기 설정</h1>
    <p class="su-lead">처음 한 번, 그리고 비밀번호나 시트를 바꿀 때만 씁니다. 입력한 주소는 이 브라우저 밖으로 나가지 않습니다. 마지막에 나오는 <b>설정 한 줄</b>을 GitHub에 <code>config.js</code>라는 파일로 저장하면 끝납니다.</p>
    ${cryptoOK() ? '' : '<div class="notice"><div>!</div><div><b>https:// 주소에서 열어야 설정 코드를 만들 수 있습니다.</b> GitHub Pages 주소 뒤에 #setup을 붙여 여세요.</div></div>'}
    <div class="card su-card"><div class="su-h"><span class="su-n">1</span>두 시트 주소</div>
      ${SU_FILES.slice().reverse().map(([f, label, idk, , fid]) => `<div class="su-f"><label for="${fid}">${label}</label><input id="${fid}" class="su-in" data-sheet="${f}" value="${esc(sheetUrl(cur[idk]))}" placeholder="https://docs.google.com/spreadsheets/d/…/edit" spellcheck="false" autocomplete="off"><span class="su-st" id="${fid}_st"></span></div>`).join('')}
      <div class="note">두 시트 모두 <b>공유 → 일반 액세스: 링크가 있는 모든 사용자 · 뷰어</b>여야 읽힙니다. 편집 권한은 따로 줍니다(지점 시트 = 지점 인원, 본사 시트 = 본사만).</div></div>
    <div class="card su-card"><div class="su-h"><span class="su-n">2</span>탭 주소 <small>권장 · 비워두면 탭 이름으로 읽음</small></div>
      <div class="note" style="margin-top:0">시트에서 탭을 하나씩 누른 뒤 주소창을 통째로 복사해 같은 이름 칸에 붙여넣으세요. 주소 끝 <code>gid=</code> 숫자가 그 탭 번호입니다. 탭 이름으로만 읽으면 숨긴·접은 행이 빠지고, 한 열에 숫자와 글자가 섞일 때 적은 쪽이 비어 읽힐 수 있습니다.</div>
      ${SU_FILES.map(([f, label, idk, gk]) => { const tabs = SPEC.filter(t => t.file === f); return `<details class="su-tabs" open><summary>${label} <small>${tabs.length}탭 · 입력 <b data-cnt="${f}">0</b></small></summary>
        ${tabs.map(t => `<div class="su-row"><label for="su_g_${t.key}">${esc(t.tab)}</label><input id="su_g_${t.key}" class="su-in" data-gk="${t.key}" data-gf="${f}" value="${esc(tabUrl(cur[idk], (cur[gk] || {})[t.key]))}" placeholder="…/edit#gid=숫자" spellcheck="false" autocomplete="off"><span class="su-st" data-gst="${t.key}"></span></div>`).join('')}</details>`; }).join('')}
    </div>
    <div class="card su-card"><div class="su-h"><span class="su-n">3</span>비밀번호</div>
      <div class="su-f"><label for="su_pw">비밀번호</label><input id="su_pw" class="su-in" type="password" autocomplete="new-password"><span class="su-st" id="su_pw_st"></span></div>
      <div class="su-f"><label for="su_pw2">한 번 더</label><input id="su_pw2" class="su-in" type="password" autocomplete="new-password"><span class="su-st" id="su_pw2_st"></span></div>
      <div class="note">이 비밀번호로 시트 주소가 암호화됩니다. 대시보드 주소가 알려져도 비밀번호 없이는 시트를 찾을 수 없으니 <b>지점에서 짐작하기 어려운 10자 이상</b>으로 정하세요. 잊어버리면 이 화면에서 새로 만들면 됩니다(데이터는 시트에 그대로 있음).</div></div>
    <div class="su-act"><button class="hbtn" id="su_test" type="button">연결 확인</button><button class="su-go" id="su_make" type="button">설정 코드 만들기</button><span class="su-msg" id="su_msg" aria-live="polite"></span></div>
    <div id="su_res"></div>
    <div id="su_code"></div>
    <p class="su-foot"><a href="./">대시보드로 돌아가기</a></p>
  </div>`;
  box.querySelectorAll('.su-in').forEach(inp => inp.addEventListener('input', suValidate));
  $('#su_test').addEventListener('click', suTest);
  $('#su_make').addEventListener('click', suMake);
  suValidate();
}
function suMsg(t, cls) { const m = $('#su_msg'); m.textContent = t || ''; m.className = 'su-msg ' + (cls || ''); }
function suSt(el, t, cls) { if (el) { el.textContent = t || ''; el.className = 'su-st ' + (cls || ''); } }
function suCollect() {
  const c = {hqSheetId: sheetIdOf($('#su_hq').value), storeSheetId: sheetIdOf($('#su_store').value), hqGids: {}, storeGids: {}};
  const probs = [];
  if (!c.storeSheetId) probs.push('지점 입력 시트 주소');
  if (!c.hqSheetId) probs.push('본사 시트 주소');
  if (c.hqSheetId && c.hqSheetId === c.storeSheetId) probs.push('두 시트가 같은 파일');
  const seen = {};
  document.querySelectorAll('[data-gk]').forEach(inp => {
    const v = inp.value.trim(); if (!v) return;
    const k = inp.dataset.gk, f = inp.dataset.gf, id = sheetIdOf(v), g = gidOf(v), want = f === 'hq' ? c.hqSheetId : c.storeSheetId;
    if (!g) { probs.push(TN(k) + ' 주소에 gid 없음'); return; }
    if (id && want && id !== want) { probs.push(TN(k) + ' — 다른 시트의 주소'); return; }
    const sk = f + ':' + g;
    if (seen[sk]) { probs.push(`${TN(k)} — ${TN(seen[sk])}와 같은 탭`); return; }
    seen[sk] = k;
    c[f === 'hq' ? 'hqGids' : 'storeGids'][k] = g;
  });
  return {c, probs};
}
function suValidate() {
  const hq = sheetIdOf($('#su_hq').value), st = sheetIdOf($('#su_store').value);
  for (const [fid, id] of [['su_hq', hq], ['su_store', st]]) {
    const v = $('#' + fid).value.trim();
    suSt($('#' + fid + '_st'), !v ? '' : !id ? '주소에서 시트 ID를 찾지 못함' : (hq && hq === st) ? '두 칸이 같은 파일' : '✓ 인식', !v ? '' : (!id || (hq && hq === st)) ? 'bad' : 'good');
  }
  const cnt = {hq: 0, store: 0}, seen = {};
  document.querySelectorAll('[data-gk]').forEach(inp => {
    const v = inp.value.trim(), k = inp.dataset.gk, f = inp.dataset.gf, el = document.querySelector(`[data-gst="${k}"]`);
    if (!v) { suSt(el, ''); return; }
    const id = sheetIdOf(v), g = gidOf(v), want = f === 'hq' ? hq : st;
    if (!g) { suSt(el, 'gid 없음', 'bad'); return; }
    if (id && want && id !== want) { suSt(el, (id === (f === 'hq' ? st : hq)) ? '다른 시트(' + (f === 'hq' ? '지점' : '본사') + ')의 탭' : '다른 시트의 주소', 'bad'); return; }
    if (seen[f + g]) { suSt(el, TN(seen[f + g]) + '와 같은 탭', 'bad'); return; }
    seen[f + g] = k; cnt[f]++;
    suSt(el, '✓ gid ' + g, 'good');
  });
  document.querySelectorAll('[data-cnt]').forEach(b => b.textContent = cnt[b.dataset.cnt] + '/' + SPEC.filter(t => t.file === b.dataset.cnt).length);
  const p1 = $('#su_pw').value.trim(), p2 = $('#su_pw2').value.trim();
  suSt($('#su_pw_st'), !p1 ? '' : p1.length < 8 ? '8자 이상' : pwWeak(p1) ? '짐작하기 쉬움' : '✓', !p1 ? '' : p1.length < 8 ? 'bad' : pwWeak(p1) ? 'warn' : 'good');
  suSt($('#su_pw2_st'), !p2 ? '' : p1 === p2 ? '✓ 일치' : '다름', !p2 ? '' : p1 === p2 ? 'good' : 'bad');
}
const pwWeak = pw => pw.length < 10 || /^\d+$/.test(pw) || /^(.)\1+$/.test(pw) || ((/^(cafe|feelm|film|gongmyeong|공명|카페|필름)/i.test(pw) || /20[0-9]{2}/.test(pw)) && pw.length < 14);

async function suTest() {
  const {c} = suCollect();
  if (!c.hqSheetId && !c.storeSheetId) { suMsg('시트 주소를 먼저 넣으세요', 'bad'); return; }
  const btn = $('#su_test'); btn.disabled = true; suMsg('읽는 중…');
  const keys = SPEC.map(t => t.key).filter(k => SPEC_BY_KEY[k].file === 'hq' ? c.hqSheetId : c.storeSheetId);
  const res = {};
  $('#su_res').innerHTML = '<div class="card su-card"><div class="note" style="margin:0">탭을 하나씩 읽고 있습니다… (큰 탭은 몇 초 걸립니다)</div></div>';
  await pool(keys, 5, async k => {
    try { const r = await fetchTab(k, c); res[k] = {ok: true, n: r.length, via: r.via, hit: r.hit, ncol: r.ncol}; }
    catch (e) { res[k] = {ok: false, err: String(e.message || e).replace(/^.*? — /, '')}; }
  });
  btn.disabled = false;
  const okN = keys.filter(k => res[k].ok).length, nameN = keys.filter(k => res[k].ok && res[k].via === 'name').length;
  suMsg(`${okN}/${keys.length}개 탭 읽음${nameN ? ` · 탭 이름으로 ${nameN}개` : ''}`, okN === keys.length ? 'good' : 'bad');
  $('#su_res').innerHTML = `<div class="card su-card"><div class="su-h">연결 확인 결과 <small>${okN}/${keys.length} 성공</small></div><div class="tbl-wrap"><table><tr><th>시트</th><th>탭</th><th>읽은 방법</th><th class="n">행</th><th>결과</th></tr>
    ${keys.map(k => { const r = res[k], f = SPEC_BY_KEY[k].file; return `<tr><td><span class="badge ${f === 'store' ? 'acc' : 'neutral'}">${FILE_LABEL[f]}</span></td><td><b>${esc(TN(k))}</b></td><td class="muted">${r.ok ? (r.via === 'gid' ? 'gid' : '탭 이름') : ''}</td><td class="n">${r.ok ? num(r.n) : ''}</td>
      <td style="white-space:normal">${r.ok ? `<span class="badge good">정상</span>${r.hit < r.ncol ? ` <span class="muted" style="font-size:11.5px">열 ${r.hit}/${r.ncol} 일치 — 빠진 열 확인</span>` : ''}` : `<span class="badge bad">실패</span> <span style="font-size:11.5px;color:var(--ink2)">${esc(r.err)}</span>`}</td></tr>`; }).join('')}</table></div>
    ${okN < keys.length ? '<div class="note">실패가 모두 같은 시트라면 그 시트의 일반 액세스(링크가 있는 모든 사용자 · 뷰어)부터 확인하세요. 일부 탭만 실패하면 그 탭 주소(gid)나 탭 이름을 확인합니다.</div>' : ''}</div>`;
}
async function suMake() {
  const {c, probs} = suCollect();
  const pw = $('#su_pw').value.trim(), pw2 = $('#su_pw2').value.trim();
  const errs = probs.slice();
  if (pw.length < 8) errs.push('비밀번호 8자 이상');
  else if (pw !== pw2) errs.push('비밀번호 두 칸이 다름');
  if (!cryptoOK()) errs.push('https:// 주소에서 열어야 함');
  if (errs.length) { suMsg('확인할 것: ' + errs.join(' · '), 'bad'); return; }
  const btn = $('#su_make'); btn.disabled = true; suMsg('암호화 중…');
  c.made = new Date().toISOString().slice(0, 10);
  let enc = '';
  try {
    enc = await encryptCfg(c, pw);
    const back = await decryptCfg(enc, pw);
    if (!back || back.hqSheetId !== c.hqSheetId || back.storeSheetId !== c.storeSheetId) throw new Error('암호화 확인 실패');
  } catch (e) { btn.disabled = false; suMsg(e.message + ' — 다시 눌러 주세요', 'bad'); return; }
  btn.disabled = false;
  const gidN = Object.keys(c.hqGids).length + Object.keys(c.storeGids).length;
  suMsg('설정 코드를 만들었습니다 — 아래 4번', 'good');
  const line = `window.CAFE_CFG = "${enc}";`;
  $('#su_code').innerHTML = `<div class="card su-card su-done"><div class="su-h"><span class="su-n">4</span>설정 코드 — GitHub에 config.js로 저장</div>
    <textarea class="su-code" id="su_line" readonly rows="3" spellcheck="false">${esc(line)}</textarea>
    <div class="su-act"><button class="su-go" id="su_copy" type="button">코드 복사</button><button class="hbtn" id="su_try" type="button">이 설정으로 지금 열어보기</button></div>
    <ol class="su-steps">
      <li>GitHub 저장소 첫 화면에서 <b>Add file → Create new file</b>을 누릅니다. 이미 <code>config.js</code>가 있으면 그 파일을 열고 연필 모양(<b>Edit this file</b>)을 누릅니다.</li>
      <li>파일 이름 칸에 <code>config.js</code>를 쓰고, 내용 칸은 모두 지운 뒤 복사한 한 줄을 붙여넣습니다.</li>
      <li><b>Commit changes</b> → 1~2분 뒤 대시보드 주소(끝에 #setup 없이)를 새로고침하고 방금 정한 비밀번호로 들어갑니다.</li>
    </ol>
    <div class="note">탭 주소 ${gidN}/${SPEC.length}개 포함${gidN < SPEC.length ? ' — 나머지는 탭 이름으로 읽습니다' : ''}. 비밀번호를 바꿀 때도 같은 방법이며, 코드를 바꾸면 모든 기기에서 새 비밀번호를 한 번 입력합니다.${pwWeak(pw) ? ' <b style="color:var(--warn)">지금 비밀번호는 짧거나 짐작하기 쉬운 편입니다.</b>' : ''}</div></div>`;
  $('#su_copy').addEventListener('click', async () => {
    const b = $('#su_copy'), ta = $('#su_line');
    try { await navigator.clipboard.writeText(line); b.textContent = '복사됨'; }
    catch (e) { ta.focus(); ta.select(); try { document.execCommand('copy'); b.textContent = '복사됨'; } catch (e2) { b.textContent = '직접 선택해 복사하세요'; } }
    setTimeout(() => b.textContent = '코드 복사', 1800);
  });
  $('#su_try').addEventListener('click', () => {   // 저장하지 않고 이 탭에서만
    applyCfg(c);
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    startApp();
  });
  $('#su_code').scrollIntoView({behavior: 'smooth', block: 'start'});
}

/* ── 앱 설치(PWA) ── */
let DEFERRED_INSTALL = null;
function initInstall() {
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(e => console.warn('[SW] 등록 실패', e));
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); DEFERRED_INSTALL = e; const b = $('#installBtn'); if (b) b.hidden = false; });
  window.addEventListener('appinstalled', () => { DEFERRED_INSTALL = null; const b = $('#installBtn'); if (b) b.hidden = true; });
}
async function doInstall() {
  if (!DEFERRED_INSTALL) { alert('브라우저 메뉴에서 설치할 수 있습니다.\n\n· 크롬/엣지: 주소창 오른쪽 설치 아이콘, 또는 메뉴 → 앱 → 이 사이트를 앱으로 설치\n· 사파리(아이폰): 공유 → 홈 화면에 추가'); return; }
  DEFERRED_INSTALL.prompt();
  try { await DEFERRED_INSTALL.userChoice; } catch (e) {}
  DEFERRED_INSTALL = null;
  const b = $('#installBtn'); if (b) b.hidden = true;
}

/* ═══════════════════════════════════════════════
   데이터 점검 · 입력 가이드(워크프레임) · 앱 시작
   ═══════════════════════════════════════════════ */
const FINDINGS = [
  // 보안
  {sev: 'bad', area: '보안', title: "신사 파일 '공명 어드민' 탭에 외부 서비스 아이디·비밀번호가 평문으로 있음", detail: '쇼핑몰·배달앱·SPC 발주·CCTV·오피스·음악 스트리밍 등. 엑셀로 내려받은 파일에도 그대로 남아 있음', fix: '탭 삭제 → 비밀번호 관리 도구(1Password 등)로 옮기고 전부 비밀번호 변경. 시트 공유 범위 점검', owner: '운영관리파트', dash: '추출하지 않음'},
  {sev: 'bad', area: '보안', title: "각 지점 파일의 '계정관리'·'계정정보' 탭", detail: '연남·홍대·망원·마곡·신사 지점 파일과 운영스케줄 파일에 계정 정보 탭이 있음', fix: '운영 파일에서 빼고 비밀번호 관리 도구로. 통합 시트에는 두지 않음', owner: '운영관리파트', dash: '열지 않음'},
  {sev: 'bad', area: '보안', title: "신사 '시트49'에 개인 연락처·계좌번호", detail: '운영 매뉴얼 메모(발주·연차·현금 입금 절차 등) 안에 섞여 있음', fix: "'운영 매뉴얼' 문서로 옮기고 개인정보는 삭제", owner: '신사 점장', dash: '추출하지 않음'},
  {sev: 'bad', area: '보안', title: '입점문의 DB에 문의자 이름·전화·신상 메모가 원문 그대로', detail: '통화 메모에 연령·가족·직장·재정 상태 서술까지 있음', fix: "Meta 리드 원본은 공유 제한 탭 하나에만. 파이프라인 탭은 리드ID로만 연결, 신상 서술 금지를 입력 규칙에 명시", owner: '출점 담당', dash: '이름·연락처·신상 서술 제거 후 190건만 사용'},
  {sev: 'warn', area: '보안', title: "'신사점 보건증 현황', 점포레포트 이슈란의 근태 기록", detail: '홍대 2~4월 이슈란 52건 중 38건이 직원 근태(지각·결근·병결)', fix: '보건증은 인사 담당만 보는 파일로, 근태는 스케줄·근태 기록으로 분리', owner: '운영관리파트', dash: '근태성 메모 38건 제외'},
  // 손익
  {sev: 'bad', area: '주간 손익', title: '2월 5주차 연남 베이커리 노무비 합계 수식이 지워짐', detail: '파티셰 인건비 659만원이 비용에서 빠져 2월 순이익이 698만원 과대 (시트 3,911만 → 실제 3,213만)', fix: '원본 W313 합계 수식 복구', owner: '운영관리파트', dash: '하위 항목 합으로 재계산해 반영'},
  {sev: 'bad', area: '주간 손익', title: '3월 5주차 원두 납품을 소계 칸에 직접 입력', detail: '신사·마곡 원두 납품 351만원이 제조시설 합계에서 누락 → 3월 순이익 351만원 과소', fix: '하위 행에 입력하고 소계는 수식으로', owner: '운영관리파트', dash: '재계산해 반영'},
  {sev: 'warn', area: '주간 손익', title: '5~8월 생산 매출 합계 수식 오류 (월 ±26만~32만)', detail: '합정 총매출이 신사 원두를 두 번 더함(5~6월), 라벨만 지워지고 값이 남은 행(7~8월), 2월 5주 합정 직영 납품 수식에 근거 없는 상수 380,200', fix: '생산 손익을 본사 시트 03_생산손익 한 행 구조로 바꾸면 합계 수식 자체가 없어짐', owner: '운영관리파트', dash: '재계산해 반영'},
  {sev: 'warn', area: '주간 손익', title: '전지점 기타 세부 행이 544행 위 셀을 참조 (5~7월 15개 블록)', detail: '매 주 블록을 복사하면서 참조가 밀림. 기타 합계는 정상이고 세부 행(배민·쿠팡 등)만 틀림', fix: '전지점 열은 지점 합으로 자동 계산', owner: '운영관리파트', dash: '지점 합으로 계산'},
  {sev: 'warn', area: '주간 손익', title: '신사 수익분배를 월 175만원 고정 추정으로 입력', detail: '신사 손익집계표의 실제 분배액은 월 99만~792만 (4월 −617만, 5월 −467만 차이 등)', fix: '월말 본사 시트 04_본사정산에 실제 분배액으로 확정', owner: '운영관리파트', dash: '시트 값 그대로 (추정치)'},
  {sev: 'warn', area: '주간 손익', title: '9월 4주차(9/21~27) 블록: 매출 비어 있고 비용은 전주 복사', detail: '그대로 두면 시트상 9월 순이익이 −6,078만원으로 보임', fix: '4주차 매출 입력', owner: '운영관리파트', dash: '이관 제외 (9/20까지 반영)'},
  {sev: 'info', area: '주간 손익', title: '매장 원두원가와 로스터리 직영 원두매출을 두 번 따로 입력', detail: '3~4월 일부 주에 두 값이 최대 124만원 어긋남', fix: '지점 시트 08_원두발주(수량) × 본사 M_원두단가 한 곳에서 금액 계산', owner: '합정 로스터리', dash: '표시만'},
  // 매출
  {sev: 'warn', area: '일매출', title: "점포레포트 '총 매출' 정의가 달·지점마다 다름", detail: '연남 1~3월은 현금·계좌이체를 품목 매출에 더하고 포인트·할인을 뺌, 홍대 2~4월은 음료+베이커리만 등. 5월 이전은 월 비교 불가', fix: '입력 탭에는 원천 숫자만, 총매출은 대시보드 한 곳에서 계산', owner: '각 지점', dash: '한 가지 정의로 재계산 (연남 1월 +381만 등)'},
  {sev: 'warn', area: '일매출', title: '수식 칸에 값을 직접 입력한 날', detail: '연남 9/18 매장계 → 9월 총매출 177,050원 과소. 신사 8/2(+800), 홍대 5/19(−900)도 같은 경우', fix: '입력 칸과 계산 칸을 분리하고 계산 칸은 보호', owner: '각 지점', dash: '재계산해 반영'},
  {sev: 'warn', area: '일매출', title: '합계 칸·파트 블록 오류', detail: '마곡 쿠팡이츠 월 합계가 0으로 입력(6·9월), 망원 매장계 합계 칸 정의가 일별 칸과 다름, 망원 파트 블록이 31일 열을 참조, 홍대 2~4월 파트 블록에 배달 누락', fix: '합계 칸 없애기 (대시보드가 계산)', owner: '각 지점', dash: '일별 값으로 재계산'},
  {sev: 'info', area: '일매출', title: '입력 관행이 지점마다 다름', detail: "신사만 할인·포인트를 양수로 입력, 마곡은 '--536325' 같은 텍스트 숫자. 포인트→협찬할인 입력 기준이 연남 6월·홍대·망원 8월에 바뀜", fix: '부호 규칙(차감은 음수)과 숫자 형식을 데이터 확인으로 강제', owner: '각 지점', dash: '음수로 통일'},
  {sev: 'info', area: '일매출', title: '목표매출·객수 칸이 전 지점 비어 있음', detail: '달성률을 볼 수 없고 객단가 분석 불가', fix: '본사 시트 01_지점에 월 목표, 지점 시트 01_일매출에 객수(POS 영수 건수) 입력', owner: '운영관리파트 · 각 지점', dash: '비어 있으면 표시 안 함'},
  // 베이커리
  {sev: 'bad', area: '베이커리', title: '매장 베이커리 탭의 매출·폐기원가 수식이 대부분 틀림', detail: '홍대는 전 제품을 한 행 가격으로 계산, 판매 수량이 이월 재고를 빼지 않아 지점당 월 2,700~2,900개 과대', fix: '지점 시트 02_베이커리판매폐기에는 수량만, 금액은 본사 M_제품 단가로 계산', owner: '각 지점', dash: '수량으로 재계산'},
  {sev: 'warn', area: '베이커리', title: '제품 원가 기준이 세 가지로 섞임, 38개 제품은 출처마다 값이 다름', detail: '직영원가 / 납품가(판매가 50%) / 마곡 55%·분석 시트 40%. 원가 미정 10종', fix: '본사 M_제품에서 원가·납품가·판매가를 한 번 확정하고 적용일로 이력 관리', owner: '연남 베이커리', dash: '직영원가로 통일, 충돌 표시'},
  {sev: 'info', area: '베이커리', title: '연남 베이커리 2025-09·10 블록이 8월 복사본, 2026-03은 1~4일만', detail: '월 블록을 복사하다 생긴 사고', fix: '월별 블록 대신 일자 열이 있는 한 탭', owner: '연남 베이커리', dash: '해당 월 제외'},
  // 재고·카드·원장
  {sev: 'warn', area: '재고수불', title: '기초 재고를 매달 손으로 옮겨 적어 전월 기말과 어긋남', detail: '8월 기준 연남 −29만, 홍대 −41만, 마곡 +16만. 94개 행은 금액 수식이 지워짐, 마곡·신사 입고 합계에 원두 빠짐', fix: '기초 = 전월 기말(조회), 사용 = 계산', owner: '각 지점', dash: '시트 값 표시 + 차이 열'},
  {sev: 'warn', area: '법인카드', title: '카드 사용내역 기록이 멈춤', detail: '연남 6/12, 신사 6/29, 홍대·망원 7/31 이후 기록 없음 → 8월 카드 사용액이 0원처럼 보임', fix: '사용 당일 지점 시트 05_법인카드에 입력, 월말 카드사 승인내역과 대조', owner: '각 지점', dash: '미기록 경고'},
  {sev: 'warn', area: '비용원장', title: "'비용 제출 예상안'을 월마다 복사해 이월 항목이 이중 계상", detail: "연남 외벽 공사 2건이 6~9월 4개 탭에, 7월 생두 1,376만원이 3번 입력. '지급' 상태가 없음", fix: '본사 시트 05_비용원장 한 탭, 같은 행을 계획→지급으로', owner: '운영관리파트', dash: '69행 → 35건으로 정리'},
  {sev: 'info', area: '원두', title: '원두 발주는 봉 수만 기록, 금액 없음', detail: '금액은 비용관리 주간 손익에서 수기로 곱함 (37,400 → 374,000 같은 오타 발생)', fix: '지점 시트 08_원두발주(수량) × 본사 M_원두단가로 대시보드가 금액 계산', owner: '합정 로스터리', dash: '단가표로 금액 계산'},
  {sev: 'info', area: '음료 원가', title: '콜드브루·아인슈페너 원가가 1/3로, 티 ICE 포장 원가는 컵이 두 번', detail: '원가표 템플릿 평균식 오류', fix: 'M_메뉴원가 + 레시피(재료 × 사용량)로 계산', owner: '본사(음료)', dash: '재계산 값 표시'},
  // 인력·리뷰·출점
  {sev: 'info', area: '인력', title: '통합 스케줄 휴무 집계 수식 51행이 깨짐, 매니저 근무를 두 곳에 입력', detail: '26.9 탭 D/O 합계 시트 177 vs 실제 191. 신사(3월 이후)·마곡(3~4월)은 통합 스케줄에 없음', fix: '2단계: 근무기록 롱포맷 한 곳에서 입력하고 월 격자는 보기용', owner: '운영관리파트', dash: '셀을 직접 세어 집계'},
  {sev: 'info', area: '인력', title: 'T.O 버전 표기(v.2026.6.16)가 실제보다 오래됨, 상태를 셀 색으로만 표시', detail: '9월 입사자가 들어 있음. 한 사람이 두 칸에 중복 기재', fix: '본사 시트 06_T.O에서 상태 드롭다운 + 기준일', owner: '운영관리파트', dash: '자리 단위로 셈'},
  {sev: 'warn', area: '리뷰', title: '리뷰 기록이 멈춤', detail: '리뷰현황 파일은 6/04 이후 없음, 홍대 지점 탭도 7월 이후 없음 → 8월은 연남만 기록. 쿠팡·배민 탭 3/11~4/05는 복사본', fix: '지점 시트 03_리뷰에 매일(또는 주 1회) 플랫폼별로', owner: '각 지점', dash: '복사본 제외, 멈춘 지점 표시'},
  {sev: 'info', area: '출점', title: '리드 상태를 셀 색으로만 표시(범례 없음), 접수일 열 삭제', detail: '입점 리드 109건은 접수일을 알 수 없어 폼 이름으로 월만 추정. 드롭 28건 중 18건은 색으로 추정', fix: "본사 시트 09_출점파이프라인 '단계' 드롭다운 + 다음 액션일", owner: '출점 담당', dash: '추정 단계 표시'},
  // 구조
  {sev: 'info', area: '파일 구조', title: '같은 파일이 두 번 (02.2026 운영스케줄)', detail: '12만 8천여 셀이 완전히 동일', fix: '하나 삭제', owner: '운영관리파트', dash: '하나만 사용'},
  {sev: 'info', area: '파일 구조', title: '숨김·사본·백업 탭 누적', detail: '비용관리 파일 22개 탭 중 16개 숨김, 메인·사본·백업·가안 4개 공존, 구버전 비용관리(2026)이 표시 상태. 월별 탭 복사로 헤더 월 표기 틀림(연남 5월 탭이 6월 등), 없는 날짜(2/29) 칸에 값 입력', fix: '라이브 탭 하나만, 과거 탭은 보관 파일로', owner: '전원', dash: '—'},
];

function renderCheck() {
  const c = s => FINDINGS.filter(f => f.sev === s).length;
  const checks = (typeof MIGCHECKS !== 'undefined' ? MIGCHECKS : []);
  let h = `<div class="g4">
    <div class="kpi"><div class="kpi-lbl">긴급</div><div class="kpi-val dn">${c('bad')}<small>건</small></div><div class="kpi-sub">보안 4 · 손익에 영향 · 수식 오류</div></div>
    <div class="kpi"><div class="kpi-lbl">주의</div><div class="kpi-val">${c('warn')}<small>건</small></div><div class="kpi-sub">정의 불일치 · 기록 중단</div></div>
    <div class="kpi"><div class="kpi-lbl">확인</div><div class="kpi-val">${c('info')}<small>건</small></div><div class="kpi-sub">구조 정리 · 입력 규칙</div></div>
    <div class="kpi"><div class="kpi-lbl">이관 검증</div><div class="kpi-val">${checks.filter(x => x.ok).length}/${checks.length || '–'}</div><div class="kpi-sub">엑셀 → 표준 탭 옮길 때 대조한 항목</div></div></div>`;
  h += `<div class="notice info"><div>ⓘ</div><div>17개 파일을 옮기면서 발견한 문제입니다. <b>대시보드 처리</b> 열은 이 화면의 숫자가 원본 시트와 왜 다를 수 있는지를 적은 것이고, <b>조치</b>는 새 워크프레임에서 같은 문제가 다시 생기지 않게 하는 방법입니다.</div></div>`;
  const areas = uniq(FINDINGS.map(f => f.area));
  h += areas.map(a => `<div class="sec-label">${esc(a)}</div><div class="card"><div class="tbl-wrap"><table class="sevrow">
    <tr><th>중요도</th><th>내용</th><th>조치</th><th>담당</th><th>대시보드 처리</th></tr>
    ${FINDINGS.filter(f => f.area === a).map(f => `<tr><td>${SEV[f.sev]}</td><td style="white-space:normal;min-width:280px"><b style="font-size:12.5px">${esc(f.title)}</b><span class="sm" style="font-weight:500;font-size:11.5px;margin-top:3px">${esc(f.detail)}</span></td>
      <td style="white-space:normal;min-width:200px;font-size:12px;color:var(--ink2)">${esc(f.fix)}</td><td style="white-space:nowrap;font-size:12px">${esc(f.owner)}</td><td style="white-space:normal;font-size:11.5px;color:var(--ink3);min-width:120px">${esc(f.dash)}</td></tr>`).join('')}
  </table></div></div>`).join('');
  if (checks.length) h += `<div class="sec-label">이관 검증 · 엑셀 → 표준 탭</div><div class="card"><div class="tbl-wrap"><table><tr><th>결과</th><th>탭</th><th>검사</th><th>세부</th></tr>
    ${checks.map(x => `<tr><td>${x.ok ? '<span class="badge good">통과</span>' : '<span class="badge bad">확인</span>'}</td><td class="muted" style="white-space:nowrap">${esc(x.table)}</td><td style="white-space:normal;min-width:220px">${esc(x.check)}</td><td style="white-space:normal;font-size:11.5px;color:var(--ink3)">${esc(x.detail)}</td></tr>`).join('')}</table></div></div>`;
  $('#tab-check').innerHTML = h;
}

/* ── 입력 가이드 = 새 워크프레임 ── */
const MAPPING = [
  ['각 지점 파일 \'_점포레포트\' 매출현황 블록', 'sales', '이슈란 → 메모 칸. 시재는 지점 보관'],
  ['각 지점 \'_베이커리(2026.07~)\' 탭', 'bk_store', '입고·판매·폐기 수량만'],
  ['리뷰현황 파일 · 지점 마케팅 탭 리뷰 블록', 'reviews', '일자·지점·플랫폼 한 행'],
  ['지점 마케팅 탭 프로모션 블록', 'promo', '하루 사용 건수'],
  ['각 지점 법인카드 사용내역', 'card', '카드번호·소지자 이름 없이'],
  ['각 지점 재고수불 월 탭', 'inv', '월이 바뀌면 행 추가, 탭 복사 금지. 원두 행은 수량만'],
  ['재고수불 원두 행의 단가(합정 로스터리 이관가)', 'inv_price', '지점끼리 보이지 않게 본사로. 단가가 바뀐 달만 한 행'],
  ['\'베이커리출고현황_월\' 탭', 'bk_ship', '가로 245열 → 일자·지점·제품코드·수량'],
  ['원두 발주 월 탭 · 연도 종합', 'beans', '수량만. 단가는 본사 M_원두단가'],
  ['\'마곡포함 비용관리(2026)\' 주간 32행 블록', 'pnl_store', '매장 5행 + 생산 2행(03_생산손익) + 본사 몇 행(04_본사정산)'],
  ['\'비용 제출 예상안\' 월별 탭', 'ledger', '같은 행을 계획 → 지급으로'],
  ['\'카페공명 T.O\'', 'to', '이름 대신 자리·상태'],
  ['통합 운영스케줄 · 지점 스케줄', 'shifts', '스케줄표는 당분간 그대로, 월 합계만 옮김'],
  ['대행사 업로드 캘린더', 'mkt', '비용·링크를 같이'],
  ['입점문의 DB 탭 7개', 'leads', 'Meta 리드 원본(개인정보)은 공유 제한 파일로'],
  ['원가정리 · 납품가 정리 · 단가표', 'products', '제품코드 BK-분류-번호. 지점 시트엔 코드·이름만(09_제품목록)'],
  ['음료 원가표 (기준일별 탭 복사)', 'menu', '적용일 행 추가'],
  ['계정관리 · 공명 어드민 · 보건증 · 시트49', null, '어느 시트에도 넣지 않음 → 비밀번호 관리 도구 · 인사 파일로'],
];
const RHYTHM = [
  {t: '매일', s: '마감 후 10분', items: [['각 지점', 'sales', '한 줄 (이슈는 메모 칸)'], ['각 지점', 'bk_store', '제품별'], ['각 지점', 'reviews', '플랫폼별, 0도 입력'], ['각 지점', 'promo', '사용 건수'], ['각 지점', 'card', '카드 쓴 날'], ['연남 베이커리', 'bk_ship', '']]},
  {t: '매주 월요일', s: '오전', items: [['합정 로스터리', 'beans', '수량만'], ['운영관리파트', 'pnl_store', '· 03_생산손익 · 04_본사정산 (지난주)'], ['운영관리파트', null, '대시보드 \'데이터 점검\'·\'점검 필요\' 확인']]},
  {t: '매월 1~3일', s: '월 마감', items: [['각 지점·연남 베이커리', 'inv', '월말 실사'], ['운영관리파트', 'pnl_hq', '월 정산분 (신사 수익분배 실제값 · SPC 수수료 · 럭키밀 · 파이브스팟)'], ['운영관리파트', 'shifts', '· 05_비용원장 계획→지급'], ['대표', null, '월 마감 확인 → 시트 잠금']]},
  {t: '수시', s: '생길 때', items: [['운영관리파트', 'ledger', '계획 등록 · 06_T.O 변동'], ['마케팅 담당', 'mkt', '비용·링크 포함'], ['출점 담당', 'leads', '단계·다음 액션'], ['본사·연남 베이커리', 'products', '가격 바뀌면 새 행 · 새 제품은 지점 시트 09_제품목록에도'], ['운영관리파트', 'inv_price', '원두 이관가가 바뀌면 지점별로 새 행'], ['운영관리파트', 'stores', '새 지점: 한 줄 추가 + 지점 시트 99_목록에 같은 이름']]},
];
const ROADMAP = [
  ['1주차', '9/29~10/5', '세팅', '두 템플릿을 구글 시트로 변환 · 권한 설정(지점 시트 = 지점 편집자, 본사 시트 = 본사만) · 00_설정/01_지점 확인 · M_제품 충돌 38종 확정 · 계정·비밀번호 탭 정리와 비밀번호 변경 · 대시보드 GitHub 배포(초기 설정 화면에서 설정 코드 만들기)'],
  ['2주차', '10/6~', '지점 입력 전환', '지점 시트 01~05 입력 시작. 기존 점포레포트는 1주만 병행 후 중단. 연남 베이커리 07, 로스터리 08 시작'],
  ['3주차', '10/13~', '본사 손익 전환', '본사 시트 02~04 주간 손익을 새 탭으로 (32행 블록 중단) · 05_비용원장 전환 · 09_출점파이프라인 단계 확인'],
  ['4주차', '10/27~11/3', '첫 월 마감', '10월 재고수불을 지점 시트 06에 · 07_근무집계 · 월 마감 체크리스트 첫 적용'],
  ['2단계', '11월~', '자동화', '02_매장손익의 매출·원가 칸을 지점 시트 값에서 자동 계산 · 근무기록 롱포맷 · POS 내보내기 붙여넣기'],
];
const tabRef = k => k ? `<b>${esc(TNF(k))}</b>` : '';

function renderData() {
  const live = SOURCE.mode === 'live';
  const rowsOf = k => (DB[k] || []).length;
  const byFile = f => SPEC.filter(t => t.file === f);
  let h = `<div class="g4">
    <div class="kpi"><div class="kpi-lbl">연동 상태</div><div class="kpi-val" style="font-size:22px">${live ? '실시간' : '스냅샷'}</div><div class="kpi-sub">${esc($('#syncTxt').textContent)}</div></div>
    <div class="kpi"><div class="kpi-lbl">지점 입력 시트</div><div class="kpi-val">${byFile('store').length}<small>탭</small></div><div class="kpi-sub">지점·베이커리·로스터리 입력 · 지점끼리 공유</div></div>
    <div class="kpi"><div class="kpi-lbl">본사 시트</div><div class="kpi-val">${byFile('hq').length}<small>탭</small></div><div class="kpi-sub">손익·원가·인력·출점 · 본사만</div></div>
    <div class="kpi"><div class="kpi-lbl">데이터 기준일</div><div class="kpi-val" style="font-size:22px">${M.lastSalesDate ? M.lastSalesDate.slice(2).replace(/-/g, '.') : '–'}</div><div class="kpi-sub">일매출 마지막 날짜</div></div></div>`;
  h += `<div class="sec-label">누가 무엇을 보나 · 권한 설계</div><div class="g3">
    <div class="card"><div class="card-title">지점 입력 시트 <small>편집: 각 지점 · 연남 베이커리 · 합정 로스터리</small></div>
      <div class="note" style="margin-top:0">매출·베이커리·리뷰·프로모션·법인카드·재고·출고·원두 발주 <b>수량</b>. 지점끼리 서로 보입니다.<br><b>원가·납품가·원두 단가·손익·인건비는 없습니다.</b> 새 제품은 코드·이름만 09_제품목록에.</div></div>
    <div class="card"><div class="card-title">본사 시트 <small>편집·열람: 본사만</small></div>
      <div class="note" style="margin-top:0">설정·지점 마스터·매장/생산 손익·본사 정산·비용 원장·T.O·근무 집계·마케팅 집행·출점·가격 마스터(M_). 지점 시트 값은 <b>옮겨 적지 않습니다</b> — 대시보드가 두 시트를 함께 읽습니다.</div></div>
    <div class="card"><div class="card-title">대시보드 <small>본사만 · 주소·비밀번호 비공유</small></div>
      <div class="note" style="margin-top:0">두 시트를 읽어 한 화면에 합칩니다. 배포용 index.html에는 시트 주소가 <b>비밀번호로 암호화</b>되어 들어가므로, 대시보드 주소가 새어도 비밀번호 없이는 시트를 찾을 수 없습니다. 원두 발주·재고 금액과 베이커리 폐기 원가는 지점 시트의 수량 × 본사 단가로 대시보드에서만 계산됩니다.</div></div></div>
    <div class="notice" style="margin-top:12px"><div>!</div><div><b>지점 시트에서 본사 시트를 IMPORTRANGE로 불러오지 마세요.</b> 한 번 연결을 허용하면 지점 시트의 편집자 누구나 범위만 바꿔 본사 시트 전체(손익 포함)를 읽을 수 있습니다. 반대 방향(본사 → 지점 시트 읽기)은 괜찮지만, 대시보드가 이미 두 시트를 직접 읽으므로 필요 없습니다.</div></div>`;
  h += `<div class="card gap"><div class="card-title">입력 3원칙 <small>지금까지 발견된 오류의 대부분이 이 셋에서 나왔습니다</small></div><table class="rule">
    <tr><td>1</td><td><b style="color:var(--ink)">한 행 = 한 건, 탭 복사 금지.</b> 월이 바뀌어도 같은 탭 맨 아래에 이어서 입력합니다. 월별 탭을 복사하면 헤더 월·31일 칸·수식 참조가 틀어집니다(연남 5월 탭의 '6월' 헤더, 2/29 칸의 도서 매출, 544행 위를 참조하는 손익 수식).</td></tr>
    <tr><td>2</td><td><b style="color:var(--ink)">입력 칸에는 원천 숫자만.</b> 총매출·합계·영업이익·원가율은 입력하지 않습니다 — 대시보드가 한 가지 정의로 계산합니다. 계산 칸에 값을 치면(연남 9/18) 이후 모든 합계가 틀립니다.</td></tr>
    <tr><td>3</td><td><b style="color:var(--ink)">지점·제품·항목은 드롭다운으로만, 개인정보는 어디에도.</b> '연남점'·'연남'·'연남(카페)'처럼 표기가 다르면 연결이 끊깁니다. 이름·연락처·계정·비밀번호·근태는 두 시트 어디에도 적지 않습니다(링크 공유 시트라 ID를 아는 사람은 누구나 읽을 수 있음).</td></tr></table></div>`;
  h += `<div class="sec-label">업무 리듬 · 누가 언제 무엇을</div><div class="flow">${RHYTHM.map(r => `<div class="card"><h4>${r.t}<span>${r.s}</span></h4><ul>${r.items.map(([w, k, t]) => `<li><b>${esc(w)}</b> — ${k ? tabRef(k) + ' ' : ''}${esc(t)}</li>`).join('')}</ul></div>`).join('')}</div>`;
  const tblFor = f => `<div class="tbl-wrap"><table><tr><th>탭</th><th>역할</th><th>입력</th><th>주기</th><th>방식</th><th class="n">현재 행</th></tr>
    ${byFile(f).map(t => `<tr><td style="white-space:nowrap"><b>${esc(t.tab)}</b></td><td style="white-space:normal;font-size:12px;color:var(--ink2);min-width:260px">${esc(t.desc)}</td><td style="font-size:12px">${esc(t.who)}</td><td style="font-size:12px;white-space:nowrap">${esc(t.freq)}</td>
      <td>${/자동|읽기/.test(t.how) ? `<span class="badge neutral">${esc(t.how)}</span>` : `<span class="badge acc">${esc(t.how)}</span>`}</td><td class="n">${num(rowsOf(t.key))}</td></tr>`).join('')}</table></div>`;
  h += `<div class="sec-label">지점 입력 시트 · 카페공명_지점입력시트</div><div class="card">${tblFor('store')}</div>`;
  h += `<div class="sec-label">본사 시트 · 카페공명_본사시트</div><div class="card">${tblFor('hq')}<div class="note">번호는 콘텐츠사업본부 시트(00_설정 · 01_월별실적 · 02_비용원장 …)와 같은 방식입니다. M_ 탭은 가격 마스터(본사만 수정), 90_ 탭은 보관(읽기 전용). 두 템플릿에는 2026-09-27까지의 기존 데이터가 이미 옮겨져 있어 바로 이어서 입력하면 됩니다.</div></div>`;
  h += `<div class="sec-label">지금 파일 → 새 탭</div><div class="card"><div class="tbl-wrap"><table><tr><th>지금 쓰는 곳</th><th>옮겨갈 탭</th><th>바뀌는 점</th></tr>
    ${MAPPING.map(([a, k, c]) => `<tr><td style="white-space:normal">${esc(a)}</td><td style="white-space:nowrap">${k ? `<span class="badge ${SPEC_BY_KEY[k].file === 'store' ? 'acc' : 'neutral'}">${FILE_LABEL[SPEC_BY_KEY[k].file]}</span> <b>${esc(TN(k))}</b>` : '<span class="badge bad">넣지 않음</span>'}</td><td style="white-space:normal;font-size:12px;color:var(--ink2)">${esc(c)}</td></tr>`).join('')}</table></div></div>`;
  h += `<div class="sec-label">전환 일정</div><div class="card"><div class="tbl-wrap"><table><tr><th>단계</th><th>기간</th><th>목표</th><th>할 일</th></tr>
    ${ROADMAP.map(([a, b, c, d]) => `<tr><td style="white-space:nowrap"><b>${a}</b></td><td class="muted" style="white-space:nowrap">${b}</td><td style="white-space:nowrap">${c}</td><td style="white-space:normal;font-size:12px;color:var(--ink2)">${esc(d)}</td></tr>`).join('')}</table></div>
    <div class="note"><b>월 마감 체크리스트</b> — ① 전 지점 일매출이 말일까지 있음 ② 주간 손익 마지막 주 입력 ③ 04_본사정산 월 정산분 확정(신사 수익분배는 실제값) ④ 재고수불 입력 ⑤ 대시보드 '데이터 점검'에 새 경고 없음 ⑥ 시트 범위 보호로 잠금.</div></div>`;
  h += `<div class="sec-label">탭별 열 정의</div>${['store', 'hq'].map(f => byFile(f).map(t => `<details class="cols"><summary><span class="badge ${f === 'store' ? 'acc' : 'neutral'}">${FILE_LABEL[f]}</span> ${esc(t.tab)} <small>${esc(t.who)} · ${esc(t.freq)}</small></summary><div class="in">
    <div class="note" style="margin:0 0 8px">${esc(t.desc)}</div><div class="tbl-wrap"><table><tr><th style="width:140px">열</th><th style="width:60px">형식</th><th>입력 내용</th></tr>
    ${t.cols.map(c => `<tr><td><b>${esc(c[0])}</b></td><td class="muted">${{s: '문자', n: '숫자', d: '날짜', m: '월'}[c[2]]}</td><td style="white-space:normal;font-size:12px;color:var(--ink2)">${esc(c[3] || '')}</td></tr>`).join('')}</table></div></div></details>`).join('')).join('')}`;
  if (live) {
    const byName = SPEC.filter(t => DB[t.key] && DB[t.key].via === 'name').map(t => t.tab);
    const errs = SOURCE.errors || [];
    h += `<div class="sec-label">지금 연결 상태</div><div class="card"><div class="note" style="margin-top:0">${SPEC.length - errs.length}/${SPEC.length}개 탭을 읽었습니다${byName.length ? ` · 탭 이름으로 읽는 탭 ${byName.length}개(${esc(byName.join(', '))}) — 초기 설정에서 탭 주소를 넣으면 더 정확합니다` : ' · 모든 탭을 탭 주소(gid)로 읽음'}.</div>
      ${errs.length ? `<ul class="errlist">${errs.map(e => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}</div>`;
  }
  h += `<div class="sec-label">대시보드 연결 · 처음 한 번</div><div class="card"><table class="rule">
    <tr><td>1</td><td>두 템플릿 xlsx를 구글 드라이브에 올리고 각각 <b>파일 → Google 스프레드시트로 저장</b>. 두 시트 모두 일반 액세스를 [링크가 있는 모든 사용자: 뷰어]로 (콘텐츠사업본부 시트와 같은 방식 — CSV로 읽기 위해 필요)</td></tr>
    <tr><td>2</td><td>편집 권한: 지점 시트에는 지점·베이커리·로스터리 인원의 구글 계정을, 본사 시트에는 본사 인원만 추가합니다. 본사 시트 주소와 대시보드 주소·비밀번호는 지점에 공유하지 않습니다</td></tr>
    <tr><td>3</td><td>GitHub 저장소에 배포 묶음(index.html · sw.js · manifest.webmanifest · 아이콘)을 올리고 Settings → Pages를 켭니다. 콘텐츠사업본부 대시보드와 같은 절차</td></tr>
    <tr><td>4</td><td>대시보드 주소를 열면 <b>초기 설정</b> 화면이 나옵니다. 두 시트 주소 · (권장) 탭 주소 · 비밀번호를 넣고 [연결 확인] → [설정 코드 만들기]</td></tr>
    <tr><td>5</td><td>나온 한 줄을 GitHub 저장소에 <code>config.js</code> 파일로 저장(Add file → Create new file) → 새로고침 → 비밀번호 입력. 비밀번호를 바꿀 때도 주소 뒤에 <code>#setup</code>을 붙여 같은 절차. 5분마다 두 시트를 다시 읽습니다</td></tr>
    <tr><td>!</td><td><b style="color:var(--bad)">GitHub 공개 저장소에는 데이터가 든 HTML(지금 보고 있는 스냅샷 버전)을 올리지 마세요.</b> 배포용 index.html은 데이터 없이 시트만 읽고, 시트 주소도 암호문으로만 들어 있습니다. 다만 링크 공유 시트는 주소를 아는 사람이면 누구나 읽을 수 있으니 본사 시트 주소를 메신저로 돌리지 말고, 개인정보·급여는 두 시트 어디에도 넣지 않습니다. 공용 PC에서는 입장할 때 '이 기기에서 기억하기'를 끄거나 오른쪽 위 [잠금]을 누르세요.</td></tr></table></div>`;
  h += `<div class="sec-label">잘 안 될 때</div><div class="card"><div class="tbl-wrap"><table><tr><th style="width:260px">증상</th><th>확인할 것</th></tr>
    ${[['어떤 지점이 표에서 빠짐', '지점 이름이 본사 시트 01_지점과 정확히 같은지 (공백·\'점\' 붙음). 종합 탭 점검 목록에 \'01_지점에 없는 지점 이름\'이 뜨면 그 이름이 원인'],
       ['새 지점을 열었음', '본사 시트 01_지점에 한 줄(유형·법인합산 포함) + 지점 시트 99_목록 A열에 같은 이름 → 드롭다운과 대시보드에 자동으로 나타남. 코드 수정 없음'],
       ['매출이 이상하게 큼/작음', '포인트·협찬할인을 음수로 넣었는지, 배민·쿠팡을 합계가 아니라 품목별로 넣었는지'],
       ['베이커리 제품이 코드로만 보임', '지점 시트 09_제품목록과 본사 M_제품에 그 코드가 있는지'],
       ['원두 금액이 비어 있음', '08_원두발주의 거래처유형·품목·규격이 본사 M_원두단가와 똑같은지, 적용일이 발주주차보다 앞인지'],
       ['손익이 월 중간까지만', '본사 시트 02~04 마지막 주차 입력 여부. 상단 안내에 입력된 날짜가 표시됨'],
       ['숫자가 0으로 읽힘', '숫자 칸에 텍스트(\'--536325\', \'1,000원\')가 들어갔는지'],
       ['날짜가 인식 안 됨', '날짜 칸 형식이 yyyy-mm-dd인지, 월 칸이 텍스트(2026-10)인지'],
       ['시트 연동 실패', '두 시트 모두 공유가 \'링크가 있는 모든 사용자 · 뷰어\'인지, 시트를 새로 만들었다면 설정 코드를 다시 만들었는지 (주소 뒤 #setup → 연결 확인으로 탭별 확인)'],
       ['\'다른 탭을 읽은 듯\' 경고', '초기 설정의 탭 주소 칸에 다른 탭 주소를 붙여넣었거나 탭 이름을 바꿈 — 탭 이름은 템플릿 그대로 두세요'],
       ['비밀번호를 잊음 · 퇴사자 발생', '주소 뒤 #setup에서 새 비밀번호로 설정 코드를 다시 만들어 config.js 내용을 교체 (데이터는 시트에 그대로). 시트 주소 자체를 알던 사람까지 막으려면 시트를 사본으로 새로 만들고 코드를 다시 만듦']].map(([a, b]) => `<tr><td><b style="font-size:12px">${a}</b></td><td style="white-space:normal;font-size:12px;color:var(--ink2)">${esc(b)}</td></tr>`).join('')}
  </table></div></div>`;
  $('#tab-data').innerHTML = h;
}

/* ── 요약 복사 ── */
function summaryText() {
  const m = UI.m;
  const stores = STORES.filter(s => M.S.sm[s] && M.S.sm[s][m]);
  const lastD = stores.map(s => M.S.sm[s][m].last).sort().pop();
  const tot = sum(stores, s => M.S.sm[s][m]._tot);
  const cmp = salesMonthCompare(m, stores);
  const cov = pnlCoverage(m), F = M.F[m];
  const y = m.slice(0, 4), ms = M.pnlMonths.filter(x => x.startsWith(y) && x <= m);
  const ytd = sum(ms, x => M.F[x].corpRev);
  const A = alertsFor(m).filter(a => a.sev !== 'info').slice(0, 4);
  const L = [];
  L.push(`[카페 공명 ${mLab(m, true)} 요약${lastD ? ' · ' + dLab(lastD) + ' 기준' : ''}]`);
  L.push(`■ 매장 매출(POS) ${won(tot)}${isNum(cmp) ? ` (전월 동기 ${fpp(cmp)})` : ''}`);
  L.push('  ' + stores.map(s => `${s} ${won(M.S.sm[s][m]._tot)}`).join(' · '));
  if (F) {
    L.push(`■ 손익${cov.full ? '' : `(${dLab(cov.last)}까지)`} 매장 영업이익 ${won(F.storeOp)} (${fp(ratio(F.storeOp, F.storeRev))}) · 최종 순이익 ${won(F.net)}`);
    const ps = STORES.filter(s => M.P.sm[s] && M.P.sm[s][m] && M.P.sm[s][m].rev > 0);
    L.push('  ' + ps.map(s => `${s} ${fp(ratio(M.P.sm[s][m]._op, M.P.sm[s][m].rev), 0)}`).join(' · '));
  }
  if (M.target) L.push(`■ 연 누적 법인 매출 ${won(ytd)} / 목표 ${won(M.target)} (${fp(ytd / M.target)})`);
  if (A.length) { L.push('■ 점검'); A.forEach(a => L.push('  - ' + a.t)); }
  return L.join('\n');
}

/* ═════════ 앱 ═════════ */
const RENDER = {summary: renderSummary, sales: renderSales, pnl: renderPnl, bakery: renderBakery, beans: renderBeans, cost: renderCost, staff: renderStaff, mkt: renderMkt, expand: renderExpand, check: renderCheck, data: renderData};
function renderTabs() {
  const alerts = alertsFor(UI.m).filter(a => a.sev === 'bad').length;
  $('#tabsBar').innerHTML = TABS.map(t => t.div ? '<span class="tab-div"></span>' :
    `<button class="tab-btn ${UI.tab === t.id ? 'active' : ''}" data-tab="${t.id}">${t.label}${t.id === 'summary' && alerts ? `<span class="cnt">${alerts}</span>` : ''}</button>`).join('');
}
function renderActive() {
  document.querySelectorAll('.section').forEach(s => s.classList.toggle('active', s.id === 'tab-' + UI.tab));
  try { RENDER[UI.tab](); } catch (e) { console.error(e); $('#tab-' + UI.tab).innerHTML = `<div class="card empty">화면을 그리는 중 오류가 났습니다: ${esc(e.message)}</div>`; }
  chartEvents($('#tab-' + UI.tab));
}
function renderAll() { renderTabs(); renderPills(); renderActive(); writeHash(); }
function setTab(id) { if (!RENDER[id]) return; UI.tab = id; renderTabs(); renderActive(); writeHash(); window.scrollTo({top: 0}); lsSet('tab', id); }
function writeHash() { try { history.replaceState(null, '', '#' + UI.tab + '-' + UI.m); } catch (e) {} }
function readHash() {
  const h = decodeURIComponent((location.hash || '').slice(1));
  if (!h) return;
  let m;
  if ((m = h.match(/tab=([a-z]+)/))) UI.tab = m[1];
  if ((m = h.match(/m=(\d{4}-\d{2})/))) UI.m = m[1];
  if ((m = h.match(/^([a-z]+)-(\d{4}-\d{2})$/))) { UI.tab = m[1]; UI.m = m[2]; }
  else if ((m = h.match(/^([a-z]+)$/))) UI.tab = m[1];
  if (!RENDER[UI.tab]) UI.tab = 'summary';
}
function fillMonths() {
  const sel = $('#monthPicker');
  sel.innerHTML = M.months.slice().reverse().map(x => `<option value="${x}">${x.replace('-', '.')}${pnlCoverage(x).full || !M.F[x] ? '' : ' (진행 중)'}</option>`).join('');
  if (!UI.m || !M.months.includes(UI.m)) UI.m = M.months[M.months.length - 1];
  sel.value = UI.m;
}
function bindEvents() {
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-tab]'); if (t) { setTab(t.dataset.tab); return; }
    const g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); setTab(g.dataset.go); return; }
    const st = e.target.closest('[data-st]'); if (st) { UI.st = st.dataset.st; renderActive(); return; }
    const lf = e.target.closest('[data-lf]'); if (lf) { UI.ledgerF = lf.dataset.lf; renderActive(); return; }
    const ps = e.target.closest('[data-psort]'); if (ps) { UI.prodSort = ps.dataset.psort; renderActive(); return; }
    const sg = e.target.closest('[data-stage]'); if (sg) { UI.leadStage = UI.leadStage === sg.dataset.stage ? null : sg.dataset.stage; renderActive(); return; }
    const kd = e.target.closest('[data-kind]'); if (kd && UI.tab === 'expand') { UI.leadKind = kd.dataset.kind; renderActive(); return; }
    if (e.target.id === 'prodMore') { UI.prodMore = !UI.prodMore; renderActive(); }
    if (e.target.id === 'leadMore') { UI.leadMore = !UI.leadMore; renderActive(); }
    const act = e.target.closest('[data-act]');
    if (act) {
      e.preventDefault();
      if (act.dataset.act === 'reload') location.reload();
      if (act.dataset.act === 'setup') { try { history.replaceState(null, '', '#setup'); } catch (x) {} showSetup(); }
    }
  });
  $('#lockBtn').addEventListener('click', lockNow);
  $('#installBtn').addEventListener('click', doInstall);
  $('#monthPicker').addEventListener('change', e => { UI.m = e.target.value; renderAll(); });
  $('#copyBtn').addEventListener('click', async () => {
    const txt = summaryText(), b = $('#copyBtn');
    try { await navigator.clipboard.writeText(txt); b.textContent = '복사됨'; }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); b.textContent = '복사됨'; } catch (e2) { b.textContent = '복사 실패'; }
      ta.remove();
    }
    setTimeout(() => b.textContent = '요약 복사', 1600);
  });
  document.addEventListener('pointermove', moveTip, {passive: true});
  window.addEventListener('hashchange', () => {
    if (/^#setup/.test(location.hash) || $('#app').hidden) return;   // #setup은 initDeploy가 처리
    const t = UI.tab, m = UI.m; readHash(); if (t !== UI.tab || m !== UI.m) { fillMonths(); renderAll(); }
  });
}
function setSync(state, txt) {
  $('#syncDot').className = 'sync-dot ' + state; $('#syncTxt').textContent = txt;
  $('#stamp').textContent = txt;
}
const hhmm = d => d.toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit'});
async function loadData() {
  if (SNAPSHOT) {
    DB = decodeSnapshot(SNAPSHOT);
    SOURCE = {mode: 'snapshot', at: SNAPSHOT.meta && SNAPSHOT.meta.built, errors: []};
    setSync('snap', `스냅샷 · ${(SNAPSHOT.meta && SNAPSHOT.meta.asOf) || ''} 기준 (엑셀 17개)`);
    return true;
  }
  const refresh = SOURCE.mode === 'live';
  if (!(CFG.hqSheetId || CFG.storeSheetId)) { SOURCE = {mode: 'none', errors: ['설정 코드가 없습니다']}; setSync('error', '설정 없음'); return false; }
  setSync('loading', refresh ? '새로 읽는 중…' : '구글 시트 읽는 중…');
  let got;
  try { got = await loadLive(); } catch (e) { got = {db: {}, errs: [e.message], heavy: []}; }
  const {db, errs, heavy} = got;
  if (!(db.sales || []).length && !(db.pnl_store || []).length) {
    if (refresh) { setSync('error', `새로 읽기 실패 · ${hhmm(SOURCE.at)} 데이터 표시 중`); return false; }
    SOURCE = {mode: 'none', errors: errs.length ? errs : ['01_일매출·02_매장손익이 모두 비어 있음']};
    setSync('error', '시트 연동 실패');
    return false;
  }
  heavy.forEach(k => { if (DB[k] && DB[k].length) db[k] = DB[k]; });   // 새로 읽는 동안 화면이 비지 않게
  DB = db; SOURCE = {mode: 'live', at: new Date(), errors: errs};
  setSync(errs.length ? 'error' : '', `시트 연동 · ${hhmm(SOURCE.at)}${errs.length ? ` (실패 ${errs.length}탭)` : ''}`);
  // 무거운 탭(베이커리 출고·판매, 재고)은 뒤에서
  pool(heavy, 3, k => fetchTab(k).then(r => { DB[k] = r || []; }).catch(e => { SOURCE.errors.push(e.message); }))
    .then(() => { buildModel(); if (!$('#app').hidden) renderActive(); if (SOURCE.errors.length) setSync('error', `시트 연동 · ${hhmm(SOURCE.at)} (실패 ${SOURCE.errors.length}탭)`); });
  return true;
}
function showLoadError() {
  const errs = (SOURCE.errors || []).slice(0, 14);
  $('#tabsBar').innerHTML = ''; $('#pillBar').innerHTML = '';
  document.querySelectorAll('.section').forEach(s => s.classList.toggle('active', s.id === 'tab-summary'));
  $('#tab-summary').innerHTML = `<div class="card gap"><div class="card-title">구글 시트를 읽지 못했습니다</div>
    <div class="note" style="margin-top:0">① 두 시트의 일반 액세스가 <b>링크가 있는 모든 사용자 · 뷰어</b>인지 ② 시트를 새로 만들었다면 설정 코드를 다시 만들었는지 확인하세요. 초기 설정 화면의 [연결 확인]으로 탭별 상태를 볼 수 있습니다.</div>
    ${errs.length ? `<ul class="errlist">${errs.map(e => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
    <div class="su-act" style="margin-top:14px"><button class="hbtn" data-act="reload" type="button">다시 시도</button><button class="hbtn" data-act="setup" type="button">초기 설정 열기</button></div></div>`;
}
function unlocked() {
  const pw = String(CFG.pw || '').trim();
  if (!pw) return true;
  const saved = lsGet('unlock');
  return !!saved && saved === btoa(unescape(encodeURIComponent(pw))).slice(0, 12);
}
let STARTED = false, REFRESH = null;
async function startApp() {
  $('#lock').hidden = true; $('#setup').hidden = true; $('#app').hidden = false;
  if (!STARTED) { bindEvents(); STARTED = true; }
  if (!SNAPSHOT) {
    document.querySelectorAll('.section').forEach(s => s.classList.toggle('active', s.id === 'tab-summary'));
    $('#tab-summary').innerHTML = '<div class="card empty">구글 시트에서 불러오는 중…</div>';
  }
  if (!(await loadData())) { showLoadError(); return; }
  buildModel();
  readHash();
  const savedTab = lsGet('tab'); if (!/^#[a-z]/.test(location.hash) && savedTab && RENDER[savedTab]) UI.tab = savedTab;
  fillMonths();
  renderAll();
  if (SOURCE.mode === 'live' && CFG.autoRefreshMin > 0 && !REFRESH) {
    let active = false, tm = null;
    document.addEventListener('pointermove', () => { active = true; clearTimeout(tm); tm = setTimeout(() => active = false, 20000); }, {passive: true});
    REFRESH = setInterval(async () => { if (active || document.hidden || $('#app').hidden) return; if (await loadData()) { buildModel(); renderAll(); } }, CFG.autoRefreshMin * 60000);
  }
}
function initSnapshot() {
  if (unlocked()) { startApp(); return; }
  showLock(async (pw, persist) => {
    if (pw !== String(CFG.pw || '').trim()) return false;
    if (persist) lsSet('unlock', btoa(unescape(encodeURIComponent(pw))).slice(0, 12));
    startApp();
    return true;
  });
}
if (SNAPSHOT) initSnapshot(); else initDeploy();

