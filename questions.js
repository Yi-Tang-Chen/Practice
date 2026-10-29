globalThis.PRACTICE_QUESTIONS = [
  {
    "id": "R01",
    "group": "reading",
    "title": "Integer literals",
    "code": "printf(\"%d %d %d\\n\", 0x10, 10, 010);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "defined",
    "output": "16 10 8",
    "explanation": "The prefixes denote hexadecimal, decimal, and octal: 0x10 is 16 and 010 is 8.",
    "walkthrough": "1. 先看整數常數的字首：沒有字首是十進位；前導 0 表示八進位；0x 表示十六進位。\n2. 0x10 = 1 × 16 + 0 = 16；10 就是十進位 10；010 = 1 × 8 + 0 = 8。\n3. %d 將數值以十進位印出，因此輸出是 16 10 8。\n\n常見誤解：010 不是把十進位 10 補上一個沒有意義的零。八進位也沒有 8、9 這兩個數字，所以 08 不是合法的八進位整數常數。"
  },
  {
    "id": "R02",
    "group": "reading",
    "title": "Characters and integers",
    "code": "printf(\"%d %d\\n\", '4' - '0', 0x34);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "defined",
    "output": "4 52",
    "explanation": "Decimal digit characters are consecutive, so '4' - '0' is 4. The hexadecimal integer 0x34 is 52.",
    "walkthrough": "1. '4' 是字元常數；它的數值來自字元編碼，不是整數 4。\n2. C 保證十進位數字字元 '0' 到 '9' 的編碼連續，因此 '4' - '0' 得到 4，不需要先假定 ASCII 的具體編碼。\n3. 0x34 是十六進位整數：3 × 16 + 4 = 52。\n4. 兩個 %d 都印十進位整數，所以結果是 4 52。\n\n可用相同方法理解 '7' - '0'，但不能隨便推論任意兩個英文字母的編碼差。"
  },
  {
    "id": "R03",
    "group": "reading",
    "title": "Integer promotions",
    "code": "uint8_t a=250, b=10;\nprintf(\"%d %u\\n\", a+b, (unsigned)(uint8_t)(a+b));",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "defined",
    "output": "260 4",
    "explanation": "Both uint8_t operands promote to int before addition. The sum is 260; converting it to uint8_t produces 4.",
    "walkthrough": "1. uint8_t 可以表示 0–255。本題的 int 是 32 bits，可以容納 uint8_t 的全部值，所以 a、b 在相加之前都提升成 int。\n2. a + b 因此以 int 計算：250 + 10 = 260。這一步沒有以 8 bits 計算，也沒有溢位。\n3. 第二個引數先把 260 轉成 uint8_t。轉成這個無號型別時，結果對 256 取模：260 % 256 = 4。\n4. 最外面的 unsigned 轉型讓引數符合 %u 所需的型別。它不會把 4 改回 260。\n\n輸出是 260 4。不是超過 256 就變成 256；是轉成 uint8_t 的那一步得到模 256 的餘數。"
  },
  {
    "id": "R04",
    "group": "reading",
    "title": "Bit fields",
    "code": "uint32_t x=0xA5u;\nx &= ~(UINT32_C(3)<<2);\nx |= UINT32_C(2)<<2;\nprintf(\"%x\\n\", (unsigned)x);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "defined",
    "output": "a9",
    "explanation": "Clear bits 2 and 3, then insert binary 10 into those positions. The final value is 0xA9; %x prints a9.",
    "walkthrough": "1. 先把 0xA5 寫成低 8 bits：1010 0101。bit 編號由最右邊的 0 開始。\n2. 3 的二進位是 11，左移兩位得到 0000 1100，選中 bit 2、3。~ 將遮罩反轉；在完整 32 bits 中是 0xFFFFFFF3。\n3. &= 表示 x = x & 遮罩。AND 在遮罩為 0 的位置清零，在遮罩為 1 的位置保留原值。\n\n```text\n1010 0101\n1111 0011  AND（這裡只畫低 8 bits）\n---------\n1010 0001  = 0xA1\n```\n\n4. 2 的二進位是 10，左移兩位得到 0000 1000。OR 把這個 1 放進目前的 x。\n\n```text\n1010 0001\n0000 1000  OR\n---------\n1010 1001  = 0xA9\n```\n\n%x 用小寫十六進位印出，所以答案是 a9。先清再填，是因為 OR 無法把原本的 1 改成 0。"
  },
  {
    "id": "R05",
    "group": "reading",
    "title": "Post-incremented pointer",
    "code": "int a[]={10,20,30}; int *p=a;\nint x=*p++;\nprintf(\"%d %d\\n\", x, *p);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "defined",
    "output": "10 20",
    "explanation": "*p++ means *(p++). Read the old first element, then advance the pointer to the next int.",
    "walkthrough": "1. p 初始指向 a[0]，那個元素的值是 10。\n2. *p++ 解析為 *(p++)。後置遞增 p++ 提供的是舊指標值，副作用則讓變數 p 移到下一個元素。\n3. 外面的 * 沿著舊位址讀取 a[0]，因此 x 得到 10。到這一行結束時，p 已指向 a[1]。\n4. printf 讀 x 得到 10，再用更新後的 p 讀 *p 得到 20。\n\n針對本題，可用這兩行理解執行後的結果：\n\n```c\nint x = *p;\np++;\n```\n\n輸出是 10 20。分清楚「p++ 這次運算提供舊位址」和「執行後 p 已存新位址」。"
  },
  {
    "id": "R06",
    "group": "reading",
    "title": "Post-incremented value",
    "code": "int a[]={10,20,30}; int *p=a;\nint x=(*p)++;\nprintf(\"%d %d %td\\n\", x, *p, p-a);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "defined",
    "output": "10 11 0",
    "explanation": "(*p)++ increments the first element, not the pointer. x gets the old value 10; p still points at a[0].",
    "walkthrough": "1. 括號指定先取得 *p，也就是 a[0] 這個元素，再對該元素做後置遞增。\n2. (*p)++ 這次提供元素的舊值 10，所以 x = 10。\n3. 遞增修改的是 a[0]，使它變成 11。p 本身沒有移動，仍指向 a[0]。\n4. 因此 *p 是 11，p - a 是 0 個元素。\n\n```c\nint x = *p;\n(*p)++;\n```\n\n輸出是 10 11 0。與 R05 不同：*p++ 移動指標，(*p)++ 修改指向的值。"
  },
  {
    "id": "R07",
    "group": "reading",
    "title": "Pre-incremented pointer",
    "code": "int a[]={10,20,30}; int *p=a;\nint x=*++p;\nprintf(\"%d %td\\n\", x, p-a);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "defined",
    "output": "20 1",
    "explanation": "*++p first advances p to a[1], then reads 20. The pointer is one element past a.",
    "walkthrough": "1. p 原本指向 a[0]。\n2. *++p 解析為 *(++p)。前置遞增 ++p 先讓 p 移到 a[1]，並提供更新後的指標值。\n3. 外面的 * 從 a[1] 讀到 20，所以 x = 20。\n4. p - a 是相距幾個元素，而不是相距幾個 bytes，因此結果為 1。\n\n針對本題，可以這樣理解：\n\n```c\n++p;\nint x = *p;\n```\n\n輸出是 20 1。R05 和 R07 最後的 p 都指向第二格，但它們分別用舊位址、新位址來取得 x。"
  },
  {
    "id": "R08",
    "group": "reading",
    "title": "Array and pointer sizes",
    "code": "int a[3]={0}; int *p=a;\nprintf(\"%zu %zu %zu\\n\",sizeof a,sizeof p,sizeof *p);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "defined",
    "output": "12 8 4",
    "explanation": "Under the stated assumptions, the array is three 4-byte ints, the pointer is 8 bytes, and one int is 4 bytes.",
    "walkthrough": "1. 先確認本題的環境假設：一個 int 是 4 bytes，一個 int 指標是 8 bytes。這些數字不是 C 語言在所有機器上的固定規定。\n2. a 的型別是 int[3]，是有三個元素的完整陣列。sizeof a 計算整個陣列：3 × sizeof(int) = 3 × 4 = 12 bytes。\n3. p 的型別是 int *。sizeof p 計算的是「存放一個指標值的變數」本身，得到 8 bytes。它不會沿著位址去計算整個陣列。\n4. *p 的型別是 int。sizeof *p 計算一個 int 的大小，得到 4 bytes。不是計算位址大小，也不是回傳元素的值。\n\n```text\na： [ int ][ int ][ int ]   整個陣列共 12 bytes\n      4      4      4\np： [ 一個指標值 ]          指標變數本身共 8 bytes\n           └── 指向 a[0]\n*p：a[0] 這個 int           一個元素共 4 bytes\n```\n\n5. {0} 把三個元素初始化為 0，但元素的內容不會改變它們的型別大小。sizeof *p 不是讀出那個 0。\n6. sizeof 的結果型別是 size_t，這裡用 %zu 印出是正確的。完整輸出是 12 8 4。\n\n常見誤解：p = a 只讓 p 指向第一個元素，不會把 p 變成一個三元素陣列。這裡的 sizeof 運算也不會把陣列 a 轉成指標。\n\n延伸：在陣列本身仍可見的地方，sizeof a / sizeof a[0] 可以算出元素數量 3。若 a 是函式的陣列形式參數，它會調整成指標，不能再用這個方式取得原陣列長度。"
  },
  {
    "id": "R09",
    "group": "reading",
    "title": "Pointer arithmetic",
    "code": "int a[3]={0};\nprintf(\"%td %td\\n\", (a+1)-a, (&a+1)-&a);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "defined",
    "output": "1 1",
    "explanation": "Both differences count elements of the respective pointed-to type. a + 1 advances one int; &a + 1 advances one entire array.",
    "walkthrough": "1. a 是 int[3]，一般運算中的 a 會轉成指向首元素的 int *。a + 1 前進一個 int。\n2. &a 是「指向整個 int[3] 陣列」的指標，型別為 int (*)[3]。&a + 1 前進一個完整的三元素陣列。\n3. 指標相減計算的是各自所指型別的元素個數，不是 bytes。\n4. 因此 (a + 1) - a 是 1，(&a + 1) - &a 也為 1。\n\n本題中兩個前進動作分別跨越 4 bytes 和 12 bytes，但相減後都得到一個各自型別的單位，所以輸出 1 1。one-past 指標可形成，但不可解參照。"
  },
  {
    "id": "R10",
    "group": "reading",
    "title": "Two-dimensional arrays",
    "code": "int a[2][3]={{1,2,3},{4,5,6}};\nprintf(\"%d %zu\\n\",*(*(a+1)+2),sizeof *a);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "defined",
    "output": "6 12",
    "explanation": "a + 1 points at the second row, whose third element is 6. sizeof *a is the size of a row of three ints.",
    "walkthrough": "1. a 是兩列、每列三個 int 的陣列。a + 1 指向第二列 a[1]。\n2. *(a + 1) 表示第二列；在後續加法中轉成指向該列首元素的指標。再加 2 就指向 a[1][2]。\n3. 最外層 * 讀出 a[1][2] 的值 6。\n4. 在 sizeof *a 中，*a 是一整列，型別為 int[3]。這裡不會轉成 int 指標，所以大小是 3 × 4 = 12 bytes。\n\n```text\na[0]： [1][2][3]\na[1]： [4][5][6]\n              ↑ a[1][2]\n```\n\n輸出是 6 12。不能因為 *a 裡有一個 *，就認為 sizeof *a 一定是一個 int；先看運算式的型別。"
  },
  {
    "id": "R11",
    "group": "reading",
    "title": "Writable arrays",
    "code": "char a[]=\"fan\"; const char *p=\"fan\";\na[0]='F';\nprintf(\"%s %s %zu\\n\",a,p,sizeof a);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "defined",
    "output": "Fan fan 4",
    "explanation": "a is a writable copy including the terminating NUL. p points at a separate string literal. Case matters in this output.",
    "walkthrough": "1. char a[] = \"fan\" 建立一個可修改的字元陣列，內容包括 f、a、n、結尾的 NUL，共四個元素。\n2. const char *p = \"fan\" 建立指標，指向字串常數。透過 p 不可修改它指向的字元。\n3. a[0] = 'F' 修改的是陣列 a。即使編譯器合併相同的字串常數，a 仍是獨立、可寫的陣列。\n4. 因此兩個 %s 分別印出 Fan 和 fan；sizeof a 計算完整陣列的四個 bytes，包含結尾 NUL。\n\n輸出是 Fan fan 4。strlen(a) 則會得到 3，因為它數的是結尾 NUL 之前的字元，不包含 NUL。"
  },
  {
    "id": "R12",
    "group": "reading",
    "title": "Unevaluated sizeof",
    "code": "int *p=NULL;\nprintf(\"%zu\\n\",sizeof *p);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "defined",
    "output": "4",
    "explanation": "For this non-VLA type, sizeof *p does not evaluate *p. It yields sizeof(int), even though p is NULL.",
    "walkthrough": "1. p 的型別是 int *，所以 *p 的型別是 int。\n2. 這裡沒有 VLA。sizeof *p 只需要知道 *p 的型別，不會真的執行這個解參照。\n3. 因此即使 p 為 NULL，這個 sizeof 仍可得到本題 sizeof(int) 的值 4。\n\n```c\nsizeof *p;  // 這裡不讀取 p 指向的物件\n// int x = *p;  // 若真的這樣讀 NULL 指標，就不合法\n```\n\n輸出是 4。不要把這個特例延伸成「NULL 可以解參照」；真正的讀寫仍需要有效物件。"
  },
  {
    "id": "R13",
    "group": "reading",
    "title": "Short-circuit evaluation",
    "code": "int i=0;\nint ok=(i++ != 0) && (++i != 0);\nprintf(\"%d %d\\n\",i,ok);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "defined",
    "output": "1 0",
    "explanation": "The left operand tests the old zero value, then increments i to 1. Since it is false, && skips the right operand.",
    "walkthrough": "1. i 初始是 0。i++ 這次提供舊值 0，之後使 i 變成 1。\n2. 左邊比較 0 != 0 得到 false。\n3. && 有短路規則：左邊已是 false，就不會計算右邊，因此 ++i 完全不執行。\n4. ok 得到 0，而 i 保持 1。\n\n輸出是 1 0。這裡有明確的求值先後規則，與 R18 的函式引數情況不同。"
  },
  {
    "id": "R14",
    "group": "reading",
    "title": "Static local storage",
    "code": "/* File scope */\nstatic int tick(void){ static int n; return ++n; }\n/* Inside main */\nint a=tick(); int b=tick();\nprintf(\"%d %d\\n\",a,b);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "defined",
    "output": "1 2",
    "explanation": "n starts at zero and retains its value between calls. The calls occur in separate full expressions.",
    "walkthrough": "1. 函式裡的 static int n 只初始化一次，沒有明寫初值時為 0。\n2. 第一次 tick() 執行 ++n，將 n 改成 1，並回傳新值 1，交給 a。\n3. 函式返回後，static 物件仍存在。第二次呼叫時 n 原本就是 1，再加一變成 2，交給 b。\n4. 這兩次呼叫放在分開的敘述中，先後次序明確。\n\n輸出是 1 2。若改成一般非 static 區域變數並在每次呼叫初始化為 0，行為就不同。"
  },
  {
    "id": "R15",
    "group": "reading",
    "title": "Unsigned wraparound",
    "code": "unsigned i=2;\nwhile(i-- != 0){ printf(\"%u \",i); }\nprintf(\"end=%u\\n\",i);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "defined",
    "output": "1 0 end=4294967295",
    "explanation": "The third condition uses the old value zero, so the loop exits, but i-- still wraps i to UINT_MAX.",
    "walkthrough": "1. i 初始為 unsigned 的 2。條件中的 i-- 使用舊值比較，但每次仍會遞減 i。\n2. 第一次：舊值 2 != 0 成立；i 變成 1，迴圈印 1。\n3. 第二次：舊值 1 != 0 成立；i 變成 0，迴圈印 0。\n4. 第三次：舊值 0 != 0 不成立，離開迴圈。但 i-- 仍已執行，無號 0 減一會繞回該型別最大值。\n5. 本題 unsigned 是 32 bits，最大值為 4294967295。\n\n因此輸出 1 0 end=4294967295。離開迴圈不代表第三次條件裡的遞減沒有發生。"
  },
  {
    "id": "R16",
    "group": "reading",
    "title": "Signed and unsigned comparison",
    "code": "size_t n=1; int x=-1;\nprintf(\"%d\\n\",x<n);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "defined",
    "output": "0",
    "explanation": "The comparison converts -1 to the unsigned 64-bit size_t type, yielding SIZE_MAX. It is not less than 1.",
    "walkthrough": "1. n 是 64-bit 無號 size_t，x 是值為 -1 的 int。\n2. 比較 x < n 之前，要先依 C 的整數轉換規則轉成共同型別。在本題條件下，x 轉成 size_t。\n3. 將 -1 轉成這個無號型別，結果是 SIZE_MAX，而不是保留負一。\n4. SIZE_MAX < 1 為 false，關係運算式的結果是 int 的 0。\n\n輸出是 0。不是所有混用 signed/unsigned 的運算都一律做同一種轉換，應先看兩者型別及可表示範圍；這題的環境假設足以確定結果。"
  },
  {
    "id": "R17",
    "group": "reading",
    "title": "Macro side effects",
    "code": "#define TWICE(x) ((x)+(x))\nint i=1;\nint y=TWICE(i++);\nprintf(\"%d %d\\n\",i,y);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "undefined",
    "output": null,
    "explanation": "TWICE(i++) expands to two unsequenced modifications of the same scalar. Parentheses do not add sequencing.",
    "walkthrough": "1. 先展開巨集：TWICE(i++) 變成 ((i++) + (i++))。\n2. 兩個加法運算元中的 i++ 都會修改同一個 scalar i。\n3. + 沒有為這兩個修改建立所需的先後順序。在 C11，對同一個 scalar 的這些未排序修改造成 UB。\n4. 不能把可能觀察到的 3、4 等數字當作保證結果。\n\n括號只能處理優先序，不能建立 sequencing。可以先在獨立敘述中計算副作用，再把單純的值交給巨集，或重新設計介面避免重複求值。"
  },
  {
    "id": "R18",
    "group": "reading",
    "title": "Unsequenced access",
    "code": "int i=1;\nprintf(\"%d %d\\n\",i++,i);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "undefined",
    "output": null,
    "explanation": "The modification i++ and the other argument's read of i are unsequenced in C11.",
    "walkthrough": "1. printf 的其中一個引數是 i++，會修改 i；另一個引數是 i，會讀取同一個 i。\n2. C11 沒有為這兩個引數的相關讀寫建立需要的先後順序，因此是同一個 scalar 上未排序的修改與讀取。\n3. 這不是單純在兩種合法輸出之間任選，而是 undefined behavior。\n\n可以把動作拆成獨立敘述，例如：\n\n```c\nint old = i++;\nprintf(\"%d %d\", old, i);\n```\n\n修正後這個例子的兩個值才明確為 1、2。原本的程式沒有保證輸出。"
  },
  {
    "id": "R19",
    "group": "reading",
    "title": "Signed overflow",
    "code": "int x=INT_MAX;\nprintf(\"%d\\n\",x+1);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "undefined",
    "output": null,
    "explanation": "INT_MAX + 1 is not representable as int. Signed overflow has undefined behavior; INT_MIN is not a guaranteed result.",
    "walkthrough": "1. INT_MAX 已經是 int 能表示的最大值。\n2. x + 1 仍以 int 計算，結果無法用 int 表示，因此發生 signed overflow。\n3. C11 對這種情況不提供結果保證，應回答 UB。\n\n不能套用無號型別的取模規則，說它一定變成 INT_MIN。需要計算時，應在相加之前檢查範圍，或確定有足夠寬的型別後先轉型再加。"
  },
  {
    "id": "R20",
    "group": "reading",
    "title": "Shift count",
    "code": "uint32_t x=UINT32_C(1)<<32;\nprintf(\"%u\\n\",(unsigned)x);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "undefined",
    "output": null,
    "explanation": "The left operand is 32 bits under these assumptions. A shift count equal to the promoted operand width is invalid.",
    "walkthrough": "1. UINT32_C(1) 在本題環境中經提升後的左運算元是 32 bits。\n2. C 的移位要求右運算元非負，而且嚴格小於提升後左運算元的位寬。\n3. 這題右邊為 32，等於位寬，已違反規則，所以是 UB；不是合法地把全部 bits 移走得到 0。\n\n若需要第 32 bit，可以先使用足夠寬的型別，例如 UINT64_C(1) << 32。事後才把錯誤移位的結果轉成 64 bits，無法補救。"
  },
  {
    "id": "R21",
    "group": "reading",
    "title": "String literals",
    "code": "char *p=\"fan\";\np[0]='F';\nprintf(\"%s\\n\",p);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "undefined",
    "output": null,
    "explanation": "Initializing the pointer is permitted in C, but attempting to modify a string literal has undefined behavior.",
    "walkthrough": "1. C 允許用 char *p 指向字串常數，但這不表示字串常數的內容可修改。\n2. p[0] = 'F' 嘗試修改字串常數，造成 UB。\n3. 不能保證輸出 Fan，也不能保證一定立刻當機。\n\n若需要可寫副本，應建立字元陣列：\n\n```c\nchar p[] = \"fan\";\np[0] = 'F';\n```\n\n這個修正版才有自己的可修改儲存空間。"
  },
  {
    "id": "R22",
    "group": "reading",
    "title": "Const pointer",
    "code": "int x=1,y=2;\nint *const p=&x;\np=&y;",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "constraint",
    "output": null,
    "explanation": "p itself is const. Assigning to it violates the modifiable-lvalue requirement, so a conforming compiler must issue a diagnostic.",
    "walkthrough": "1. 從宣告讀出 int *const p：p 是「本身不可重新賦值的指標」，指向的 int 則沒有 const 限制。\n2. 初始化 p = &x 合法，但後續 p = &y 嘗試重新指定 p，違反可修改左值的要求。\n3. 這是 constraint violation，需要編譯器給出診斷，不能把它當成一般執行中的 UB 題。\n\n*p = 9 可以修改 x；p = &y 卻不能修改 p 本身。\n\n對照 const int *p：那種宣告是指標可換位址，但不能透過它修改所指的 int。"
  },
  {
    "id": "R23",
    "group": "reading",
    "title": "Overlapping memcpy",
    "code": "char s[]=\"abcdef\";\nmemcpy(s+1,s,4);\nprintf(\"%s\\n\",s);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "undefined",
    "output": null,
    "explanation": "The source and destination ranges overlap. memcpy does not permit this; use memmove for overlapping ranges.",
    "walkthrough": "1. memcpy(s + 1, s, 4) 的來源是原本的索引 0–3，目的地是索引 1–4。\n2. 這兩段記憶體互相重疊，而 memcpy 的契約不允許重疊。\n3. 因此應回答 UB。不能靠自行假設正向複製或實際測出某個字串，宣稱結果固定。\n\n若要容許重疊，應使用 memmove；下一題 R24 就是這個修正。"
  },
  {
    "id": "R24",
    "group": "reading",
    "title": "Overlapping memmove",
    "code": "char s[]=\"abcdef\";\nmemmove(s+1,s,4);\nprintf(\"%s\\n\",s);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "defined",
    "output": "aabcdf",
    "explanation": "The original abcd is copied into positions 1 through 4. Position 5 remains f and the terminator remains at position 6.",
    "walkthrough": "1. 原字串是 a b c d e f NUL。搬移前先看來源的四個字元：a b c d。\n2. memmove 保證結果如同先保留原始來源再寫入，因此可安全處理重疊。\n3. 原本的 a、b、c、d 被放到索引 1、2、3、4；索引 0 的 a 不變，索引 5 的 f 也不變。\n\n```text\n索引：0 1 2 3 4 5 6\n原本：a b c d e f NUL\n結果：a a b c d f NUL\n```\n\n因此 %s 印出 aabcdf。不是 aabcde；最後的 f 不在這次搬移的目的範圍內。"
  },
  {
    "id": "R25",
    "group": "reading",
    "title": "One-past pointers",
    "code": "int a[3]={1,2,3};\nint *end=a+3;\nprintf(\"%td\\n\",end-a);\nprintf(\"%d\\n\",*end);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "undefined",
    "output": null,
    "explanation": "Forming end and subtracting pointers is valid, but dereferencing the one-past pointer is not. The first difference is 3; the whole program has no guaranteed output.",
    "walkthrough": "1. a 有三個元素，所以 a + 3 是合法形成的 one-past 指標，指向最後元素後方的位置。\n2. end - a 也合法，差為 3 個元素。\n3. 但該 one-past 位置不是可讀取的陣列元素。第二個 printf 的 *end 解參照了這個位置，造成 UB。\n4. 這題要求判斷整段程式，所以不能回答「保證先印 3，後面隨機」。整段含 UB 的程式沒有那種保證。\n\n分清楚「可以形成這個指標」與「可以讀取它指向的位置」。"
  },
  {
    "id": "R26",
    "group": "reading",
    "title": "Right shift of a negative int",
    "code": "int x=-4;\nprintf(\"%d\\n\",x>>1);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "implementation",
    "output": null,
    "explanation": "C11 makes right shift of a negative signed integer implementation-defined. -2 is common, but is not the only result allowed by C11.",
    "walkthrough": "1. x 是值為 -4 的 signed int。\n2. 在 C11，對負的 signed 整數做右移，其結果是 implementation-defined。\n3. 常見實作採算術右移，得到 -2，但題目的 C11 規則沒有指定這是所有實作唯一的結果。\n\n應回答 implementation-defined，並說要查編譯器／實作文件。它與 UB 不同：實作定義的選擇需要被記載。"
  },
  {
    "id": "R27",
    "group": "reading",
    "title": "Argument evaluation order",
    "code": "/* File scope */\nint left(void){puts(\"L\");return 1;}\nint right(void){puts(\"R\");return 2;}\n/* Inside main */\nprintf(\"%d %d\\n\",left(),right());",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "unspecified",
    "output": null,
    "explanation": "Either L then R or R then L may be printed before the final line 1 2. There is no conflicting unsequenced scalar access here.",
    "walkthrough": "1. left() 和 right() 分別印出 L、R，再回傳 1、2。\n2. C11 沒有指定這兩個函式引數的求值順序，所以可以先印 L 再印 R，也可以相反。\n3. 無論先後，left() 的回傳值仍是第一個 %d 的引數，right() 的回傳值仍是第二個 %d 的引數，因此最後一行都是 1 2。\n4. 這裡沒有 R18 那種對同一個 scalar 的衝突讀寫，不能一看到順序未指定就說 UB。\n\n分類是 unspecified evaluation order；可能的整段順序為 L / R / 1 2，或 R / L / 1 2。"
  },
  {
    "id": "R28",
    "group": "reading",
    "title": "Automatic object lifetime",
    "code": "int *make(void){int x=7;return &x;}\n/* caller */\nint *p=make(); printf(\"%d\\n\",*p);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "undefined",
    "output": null,
    "explanation": "The local x has reached the end of its lifetime before the caller dereferences the returned pointer.",
    "walkthrough": "1. make 裡的 x 是一般區域物件，生命週期在函式返回時結束。\n2. 回傳 &x 只回傳一個位址，不會讓 x 繼續存在。\n3. 呼叫端透過失效指標執行 *p，造成 UB。記憶體看起來仍殘留 7，不代表物件仍有效。\n\n常見介面修法是直接回傳 int 的值，或由呼叫端提供輸出位置。若改用動態配置，則必須另外定義誰負責釋放。"
  },
  {
    "id": "R29",
    "group": "reading",
    "title": "Use after free",
    "code": "int *p=malloc(sizeof *p);\nif(p!=NULL){*p=7;free(p);printf(\"%d\\n\",*p);}",
    "prompt": "Assume malloc succeeds. Classify the behavior on that path.",
    "kind": "undefined",
    "output": null,
    "explanation": "On the allocation-success path, free ends the allocated object's lifetime and the later dereference is invalid. If allocation fails, the body is skipped.",
    "walkthrough": "1. 這題先限定 malloc 成功的路徑。配置成功時，p 指向仍存活、可寫的 int，*p = 7 合法。\n2. free(p) 結束該配置物件的生命週期。\n3. 後面的 printf 再執行 *p，讀取已釋放的物件，是 use-after-free，造成 UB。\n4. 若 malloc 失敗，if 內完全不執行；那條路徑不會發生這次 use-after-free，也不會印 7。\n\n把列印移到 free 之前才可讀取有效物件。p = NULL 不能讓已釋放物件復活，也不能修復其他指向同一配置的別名。"
  },
  {
    "id": "R30",
    "group": "reading",
    "title": "Structure layout",
    "code": "struct S {char c;int i;};\nprintf(\"%zu\\n\",sizeof(struct S));",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "layout",
    "output": null,
    "explanation": "The assumptions do not specify structure alignment and padding. A size of 8 is common, but no single structure size follows from the given information.",
    "walkthrough": "1. struct S 包含 char 和 int，但 sizeof(struct S) 不一定只是 sizeof(char) + sizeof(int)。\n2. 實作可在成員之間插入 padding，結尾也可能有 padding，以符合對齊與陣列元素配置需求。\n3. 常見的 4-byte int、4-byte int 對齊 ABI 會得到 1 byte char、3 bytes padding、4 bytes int，合計 8。\n4. 題目沒有提供 struct 的 ABI／對齊規則，因此不能把這個常見 8 當成唯一答案，也不能直接回答 5。\n\n應選 depends on ABI / layout。知道單一 int 是 4 bytes，仍不足以確定整個結構的大小。"
  },
  {
    "id": "R31",
    "group": "reading",
    "title": "Alignment and effective type",
    "code": "unsigned char bytes[8]={1};\nuint32_t x=*(uint32_t *)(bytes+1);\nprintf(\"%u\\n\",(unsigned)x);",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "undefined",
    "output": null,
    "explanation": "bytes + 1 is not guaranteed to satisfy uint32_t alignment. Reading a declared character array through a uint32_t lvalue also violates the effective-type access rules.",
    "walkthrough": "1. bytes 是宣告好的 unsigned char 陣列。bytes + 1 是往後一個 byte 的位置。\n2. 將位址轉成 uint32_t * 不會自動修好對齊；該位置未必滿足 uint32_t 的對齊需求。\n3. 即使位址剛好對齊，透過 uint32_t 左值讀取這個宣告為字元陣列的儲存空間，仍有 effective-type／aliasing 規則的問題。\n4. 不能因為某台 CPU 支援非對齊讀取，就認為整段 C 程式合法。\n\n應回答 UB。可逐 byte 解碼；或先把足夠的 bytes memcpy 到真正的 uint32_t 物件，再依格式處理 byte order。字元型別可用來讀其他物件的表示，並不保證反方向的 typed cast 讀取也合法。"
  },
  {
    "id": "R32",
    "group": "reading",
    "title": "Missing terminator",
    "code": "char s[4]={'f','a','n','!'};\nprintf(\"%zu\\n\",strlen(s));",
    "prompt": "State the output if it is guaranteed; otherwise classify the behavior.",
    "kind": "undefined",
    "output": null,
    "explanation": "There is no NUL within s. strlen reads past the array while looking for a terminator, which is undefined behavior.",
    "walkthrough": "1. s 只有四個元素：f、a、n、!，沒有字串終止字元 NUL。\n2. strlen 不是取得陣列容量；它會持續找 NUL，並計算 NUL 之前有幾個字元。\n3. 在這個陣列內找不到終止字元，搜尋會超出合法的陣列範圍，造成 UB。\n\n不能回答 4；sizeof s 才是在此處取得陣列總大小 4 的方式。若要建立有效字串，可使用 char s[] = \"fan!\"，讓編譯器加上終止 NUL。"
  },
  {
    "id": "C01",
    "group": "concepts",
    "title": "What values do `0x10`, `10`, and `010` represent? Convert `0x34` to decimal.",
    "body": "What values do `0x10`, `10`, and `010` represent? Convert `0x34` to decimal.\n\nFollow-up: Does writing a value in hexadecimal determine its type or storage width? Can `uint8_t` hold `0x10`?",
    "reference": "0x10 是十六進位 16；10 是十進位 10；C 的 010 是八進位 8。0x34 是 3×16+4=52。字首只決定常數的寫法；型別還要看數值與 suffix。\n\n延伸：0x10 需要 uint16_t 才能存嗎？不需要，uint8_t 已可容納。",
    "mode": "self"
  },
  {
    "id": "C02",
    "group": "concepts",
    "title": "Given `uint8_t a = 250, b = 10`, what is the difference between evaluating `a + b` and storing the result in a `uint8_t`?",
    "body": "Given `uint8_t a = 250, b = 10`, what is the difference between evaluating `a + b` and storing the result in a `uint8_t`?\n\nFollow-up: Can you apply the same reasoning to `INT_MAX + 1`? Explain the relevant conversion and overflow rules.",
    "reference": "在 int 可容納 0–255 的本環境，兩者先提升成 int，a+b 是 260。轉成 uint8_t 後依其範圍取模成 4。窄儲存型別不代表每一步都用 8-bit 計算。\n\n延伸：若 signed int 已到 INT_MAX 再加一，可以類比嗎？不行，signed overflow 是 UB。",
    "mode": "self"
  },
  {
    "id": "C03",
    "group": "concepts",
    "title": "How do you set, clear, toggle, and test bit `k`? State the valid range of `k`.",
    "body": "How do you set, clear, toggle, and test bit `k`? State the valid range of `k`.\n\nFollow-up: On a platform with 32-bit `int`, what must you consider when choosing the left operand for a shift into bit 31?",
    "reference": "以 uint32_t 模型，k 必須 0–31，遮罩是明確的 32-bit unsigned 1 左移 k。設定 OR、清除 AND 反相遮罩、反轉 XOR；測試 AND 結果是否非零。先驗 k，不能做完非法移位才檢查。\n\n延伸：bit 31 若用 signed 1 左移，在 32-bit int 下有什麼風險？結果不可表示會是 UB。",
    "mode": "self"
  },
  {
    "id": "C04",
    "group": "concepts",
    "title": "What is the difference between `&` and `&&`? How do you test whether any masked bit is set, or whether all masked bits are set?",
    "body": "What is the difference between `&` and `&&`? How do you test whether any masked bit is set, or whether all masked bits are set?\n\nFollow-up: What do the two tests return when the mask is zero? Should an API accept an empty mask?",
    "reference": "& 逐位處理兩個整數；&& 是真偽判斷，且短路。任一存在看 (flags & mask)!=0，全部存在看 (flags & mask)==mask。後者不是隻比較結果是否非零。\n\n延伸：mask=0 時兩種判斷不同；API 要不要允許空 mask？先定契約。",
    "mode": "self"
  },
  {
    "id": "C05",
    "group": "concepts",
    "title": "Why does `x & (x - 1)` clear the lowest set bit? What happens when unsigned `x` is zero?",
    "body": "Why does `x & (x - 1)` clear the lowest set bit? What happens when unsigned `x` is zero?\n\nFollow-up: What changes if `x` is a signed integer equal to `INT_MIN`?",
    "reference": "對 unsigned，非零 x 減一會把最低 1 變 0、較低的 0 變 1，AND 後只有最低 1 被清掉。x=0 時 unsigned 減一為最大值，AND 還是 0；判斷二次方要額外排除 0。\n\n延伸：若 x 是 INT_MIN 的 signed 型別，x-1 可能 signed overflow。",
    "mode": "self"
  },
  {
    "id": "C06",
    "group": "concepts",
    "title": "Is reversing 16 bits the same as swapping two bytes?",
    "body": "Is reversing 16 bits the same as swapping two bytes?\n\nFollow-up: Reverse the bits of `0x5678`. First check your method with a four-bit example.",
    "reference": "不一樣。0x1234 byte swap 是 0x3412；bit reverse 是 0x2C48。bit reverse 同時反轉每個 byte 內部 bits 與 byte 次序。\n\n延伸：0x5678 bit reverse 是 0x1E6A；先用 4-bit 小例子驗演算法。",
    "mode": "self"
  },
  {
    "id": "C07",
    "group": "concepts",
    "title": "Why is `(1ULL << width) - 1` unsuitable for `width == 64` when `unsigned long long` is 64 bits?",
    "body": "Why is `(1ULL << width) - 1` unsuitable for `width == 64` when `unsigned long long` is 64 bits?\n\nFollow-up: How would you validate `offset` and `width` without overflowing in `offset + width`?",
    "reference": "若左運算元是 64 bits，移位 64 就是 UB。合法 mask 不能透過不合法的中間運算產生；全寬直接用 UINT64_MAX。ULL 至少 64 bits，但語意最好明確指定目標型別。\n\n延伸：offset+width 先相加也可能 unsigned wrap；改驗 width 範圍後比較 offset<=64-width。",
    "mode": "self"
  },
  {
    "id": "C08",
    "group": "concepts",
    "title": "Does little-endian describe bit order or byte order?",
    "body": "Does little-endian describe bit order or byte order?\n\nFollow-up: How can you decode a packet field without relying on the host byte order?",
    "reference": "描述多 byte 數值在記憶體中的 byte 次序。0x1234 以 little-endian 放成 34、12；不表示 byte 內 bit 反轉。wire format 的 endian 與 CPU 的 endian 也可不同。\n\n延伸：讀 packet 時用逐 byte 解碼，避免依賴 host 大小端。",
    "mode": "self"
  },
  {
    "id": "C09",
    "group": "concepts",
    "title": "Given `int *p`, explain `p`, `*p`, and `&p`.",
    "body": "Given `int *p`, explain `p`, `*p`, and `&p`.\n\nFollow-up: If `p` points into an array, how far does `p + 1` advance?",
    "reference": "p 是存放位址的指標值；*p 是所指 int 的左值；&p 是指標變數自己的位址，型別 int **。三者不是同一個物件。解參照需要有效、對齊且生命週期尚在的 int。\n\n延伸：若 p 指向陣列，p+1 的步長由所指型別決定。",
    "mode": "self"
  },
  {
    "id": "C10",
    "group": "concepts",
    "title": "Compare `sizeof p`, `sizeof *p`, `sizeof array`, and `strlen`.",
    "body": "Compare `sizeof p`, `sizeof *p`, `sizeof array`, and `strlen`.\n\nFollow-up: Inside a function declared with parameter `int a[10]`, can `sizeof a` recover the array length?",
    "reference": "指標的 sizeof 是指標大小；sizeof *p 是所指型別大小；真正的固定陣列 sizeof 包含所有元素；strlen 走訪字元直到 NUL，長度不含 NUL。sizeof 通常不求值，但 VLA 例外。\n\n延伸：函式引數 int a[10] 調整成 int*，不能用 sizeof a 推回長度。",
    "mode": "self"
  },
  {
    "id": "C11",
    "group": "concepts",
    "title": "For an array `a`, how do `a` and `&a` differ?",
    "body": "For an array `a`, how do `a` and `&a` differ?\n\nFollow-up: Can you form a pointer one past the final element? Can you dereference it?",
    "reference": "多數運算下 a 轉成首元素指標；&a 是整個陣列的指標。例如 int a[3]：a+1 前進一個 int，&a+1 前進整個 3-int 陣列。數值位址起點可以相同，型別與步長不同。\n\n延伸：合法形成 one-past 指標，但不能解參照它。",
    "mode": "self"
  },
  {
    "id": "C12",
    "group": "concepts",
    "title": "Does passing a pointer in C give the callee a C++ reference to the caller's pointer variable?",
    "body": "Does passing a pointer in C give the callee a C++ reference to the caller's pointer variable?\n\nFollow-up: Why must the caller save the return value of `remove_value` in P08? How could you instead let a function update the caller's pointer?",
    "reference": "C 引數都是傳值，包含指標值。傳 int* 可以改所指 int，但把函式內引數 p 改成別的位址不會改呼叫者的指標。要改 caller pointer，可回傳新指標或傳 int**。\n\n延伸：P08 呼叫者要 head=remove_value(head,target)，否則新頭可能被忽略。",
    "mode": "self"
  },
  {
    "id": "C13",
    "group": "concepts",
    "title": "What do `malloc`, `calloc`, `free`, and assigning `NULL` to a pointer each do?",
    "body": "What do `malloc`, `calloc`, `free`, and assigning `NULL` to a pointer each do?\n\nFollow-up: Does the all-zero byte pattern produced by `calloc` guarantee a null pointer or floating-point zero for every C implementation?",
    "reference": "malloc 配置指定 bytes、不初始化；calloc 配置陣列並將儲存 bytes 設為零；free 結束那塊配置的生命週期；設 NULL 只改那個指標。free(NULL) 可行，double free 與使用已釋放物件不行。\n\n延伸：calloc 的全零 bytes 不等於標準保證所有型別的語意零；使用指標／浮點要注意表示。",
    "mode": "self"
  },
  {
    "id": "C14",
    "group": "concepts",
    "title": "How do you check for overflow before calculating the size of an allocation for `count` objects of type `T`?",
    "body": "How do you check for overflow before calculating the size of an allocation for `count` objects of type `T`?\n\nFollow-up: What further checks are needed when adding a header and rounding up to an alignment?",
    "reference": "若 sizeof(T)>0，先檢查 count>SIZE_MAX/sizeof(T)。成立就拒絕，否則乘法可在 size_t 表示。計算後再看是否超過 SIZE_MAX 沒有效果，因為它已經 wrap。\n\n延伸：加 header 時另驗 total>SIZE_MAX-header；alignment 還有第三次檢查。",
    "mode": "self"
  },
  {
    "id": "C15",
    "group": "concepts",
    "title": "When should you use `memcpy`, and when should you use `memmove`?",
    "body": "When should you use `memcpy`, and when should you use `memmove`?\n\nFollow-up: Does one successful run prove that an overlapping `memcpy` is valid?",
    "reference": "來源與目的不重疊才可用 memcpy；重疊用 memmove。memmove 保證像先把原始資料儲存後再寫入的結果，實作不一定真的配置暫存區。\n\n延伸：只看到一個正常例子成功不能證明 memcpy 對重疊有效。",
    "mode": "self"
  },
  {
    "id": "C16",
    "group": "concepts",
    "title": "Why might moving bytes to a higher offset require copying from the end?",
    "body": "Why might moving bytes to a higher offset require copying from the end?\n\nFollow-up: Can you use `<` to compare pointers into unrelated objects? How does using offsets within one buffer help?",
    "reference": "同一 buffer 內，向右重疊搬移若正向寫，會覆蓋後面尚未讀取的來源。從尾端往前可保住未讀資料。向左重疊則正向即可。\n\n延伸：不要對不相關物件指標任意做 < 比較；P04 用同一 buffer 的 offsets。",
    "mode": "self"
  },
  {
    "id": "C17",
    "group": "concepts",
    "title": "Explain ownership, a borrowed view, and a deep copy.",
    "body": "Explain ownership, a borrowed view, and a deep copy.\n\nFollow-up: In P05, can the output structure remain valid while its payload pointer becomes invalid? Describe the input buffer's lifetime requirements.",
    "reference": "owner 負責資源生命週期；borrower 暫時使用別人持有的資料；deep copy 把需要的內容另存，能有獨立生命週期。只複製含指標的 struct 通常是 shallow copy，不會複製 payload。\n\n延伸：P05 out 有效不代表 payload 一直有效；問清楚原始 bytes 何時回收。",
    "mode": "self"
  },
  {
    "id": "C18",
    "group": "concepts",
    "title": "Why does a linked-list node contain a `node_t *next` rather than a `node_t next`?",
    "body": "Why does a linked-list node contain a `node_t *next` rather than a `node_t next`?\n\nFollow-up: When deleting or unlinking a node, when should you save its next pointer?",
    "reference": "指標連到另一個節點，節點本體大小可固定。若直接把同一完整型別的 next 本體放進自己，會需要無限大小。空串列或尾端用 NULL 結束。\n\n延伸：遍歷時先儲存下一個節點，尤其刪除或改 next 前。",
    "mode": "self"
  },
  {
    "id": "C19",
    "group": "concepts",
    "title": "How would you remove matching nodes at the head, tail, and in consecutive runs without skipping nodes?",
    "body": "How would you remove matching nodes at the head, tail, and in consecutive runs without skipping nodes?\n\nFollow-up: Can a `node_t **` represent either the head pointer or a previous node's next pointer?",
    "reference": "維護目前連結位置，遇符合節點就把該連結接到 next，不先往後跳；不符合才前進。要明確決定是否 free、是否把移出節點 next 清空。P08 caller 擁有節點，所以不 free。\n\n延伸：能否用 node_t** 指向 head 或前節點 next，把頭節點特例統一？可以。",
    "mode": "self"
  },
  {
    "id": "C20",
    "group": "concepts",
    "title": "Distinguish a dangling pointer, a memory leak, and an out-of-bounds access.",
    "body": "Distinguish a dangling pointer, a memory leak, and an out-of-bounds access.\n\nFollow-up: How would you investigate a suspected memory leak in firmware that runs for weeks?",
    "reference": "### 先分清楚這三種問題\n\n- **Dangling pointer（懸空指標）**：位址還存在變數裡，但那塊記憶體已經不能使用。\n- **Memory leak（記憶體洩漏）**：申請了記憶體，工作做完卻沒有回收，讓可用空間越來越少。\n- **Out-of-bounds（越界）**：記憶體還在，但你讀寫的位置超過它的合法範圍。\n\n### 用程式看差別\n\n```c\nint *p = malloc(sizeof *p);\nif (p != NULL) {\n    *p = 10;\n    free(p);\n    // 此後 p 是懸空指標，不能再做 *p = 20。\n    p = NULL;\n}\n```\n\n`free` 回收空間；`p = NULL` 只是清掉 p 保存的位址。如果先前還有 `int *q = p;`，把 p 清空並不會讓 q 也變成 NULL，q 仍不能使用。\n\n洩漏的例子：函式裡 malloc 成功，離開時沒有 free，也沒把位址交給其他人管理。空間沒有回收，自己又找不到它。即使仍保存指標，一直留下不再需要的配置，也可能造成持續成長的資源問題。\n\n```c\nint a[3] = {10, 20, 30};\na[2] = 99;  // 合法：索引只有 0、1、2\n// a[3] = 99;  // 越界：沒有第 4 個元素\n```\n\n### 追問：跑幾週才發現空間不夠，怎麼查？\n\n先記錄「申請總量、釋放總量、目前仍占用的量」，觀察重複同一項工作後，記憶體會不會回到原來水位。再追是哪種物件、哪條錯誤路徑只申請不釋放。可以加速重複連線、斷線等操作重現；不能只看到 crash 就斷定是洩漏，越界和 stack 用完也會出問題。\n\n**先會說這句就好：懸空是用到已失效的空間，洩漏是該回收卻沒回收，越界是用超過範圍。**",
    "mode": "self"
  },
  {
    "id": "C21",
    "group": "concepts",
    "title": "Explain `const int *`, `int *const`, and `const int *const`.",
    "body": "Explain `const int *`, `int *const`, and `const int *const`.\n\nFollow-up: When, if ever, can you cast away `const` and write through the resulting pointer?",
    "reference": "### 先分開看 p 和 *p\n\n`p` 保存位址；`*p` 是那個位址裡的 int。這題就是問：不准改的是「位址」，還是「裡面的值」？\n\n```c\nint a = 10, b = 20;\nconst int *p = &a;\np = &b;       // 可以：p 改指向 b\n// *p = 30;   // 不可以：不能透過 p 改 int\n```\n\n```c\nint *const q = &a;\n*q = 30;      // 可以：修改 a\n// q = &b;    // 不可以：q 自己不能換位址\n```\n\n```c\nconst int *const r = &a;\n// r = &b;    // 不可以換位址\n// *r = 40;   // 也不可以透過 r 改值\n```\n\n可先記成：`const int *` 保護指向的值；`int *const` 固定指標本身；兩邊都有 const 就兩邊都限制。\n\n### 追問：強制轉型拿掉 const 就能寫嗎？\n\n要看原本的物件。若原本是 `const int a = 10;`，拿掉 const 再寫 a 是未定義行為，不能做。若原本是普通的 `int a`，只是透過 const 指標看它，底下的 a 並沒有因此變成不可修改；但仍要遵守函式介面的約定。初學時先不要用 cast 硬繞過 const。\n\nconst 也不表示資料一定放在 ROM；它先是一個 C 型別上的存取限制。",
    "mode": "self"
  },
  {
    "id": "C22",
    "group": "concepts",
    "title": "Compare a local static variable, a file-scope static variable, and a static function.",
    "body": "Compare a local static variable, a file-scope static variable, and a static function.\n\nFollow-up: Does a local static variable make an increment thread-safe? What happens during recursive calls?",
    "reference": "### static 放的位置不同，意思也不同\n\n先看兩個問題：「這份資料活多久？」以及「哪裡可以用這個名字？」\n\n**1. 函式裡的 static：離開函式後，值還留著。**\n\n```c\nint next_id(void) {\n    static int n = 0;\n    n++;\n    return n;\n}\n```\n\n連續呼叫會得到 1、2、3。`n` 不是每次進函式都重設成 0；它在程式執行期間一直存在，但名字只在這個函式區塊裡能直接使用。普通的 `int n = 0;` 則每次呼叫建立自己的 n。\n\n**2. 函式外的 static 變數：整個程式期間存在，名稱限制在這個 .c 編譯出的單元裡。**\n\n```c\nstatic int counter = 0;\n```\n\n**3. static 函式：限制函式名稱的對外連結。**\n\n```c\nstatic void helper(void) {\n    // 給這個 .c 內部使用的輔助函式\n}\n```\n\n其他 .c 不能只寫一個 extern 宣告，就直接連結到這個 helper。這裡的「單元」包含這個 .c 展開 include 後的內容，通常先理解成「這個 .c 內部」就夠了。\n\n### 追問：static 會自動避免同時修改嗎？\n\n不會。兩個 thread 同時做 `n++`，仍可能互相干擾，需要鎖或原子操作。遞迴呼叫也共用同一份 static n；它不像普通區域變數，每層各有一份。",
    "mode": "self"
  },
  {
    "id": "C23",
    "group": "concepts",
    "title": "Does putting an `extern` declaration in a header allocate storage?",
    "body": "Does putting an `extern` declaration in a header allocate storage?\n\nFollow-up: What is the default linkage of a file-scope `const` object in C, and how does that differ from C++?",
    "reference": "### 宣告是在介紹名字，定義才提供那個物件\n\n可以把 header 裡的 extern 想成：「程式裡有一個叫 counter 的 int，真正那一份放在別處。」\n\n```c\n// counter.h：讓其他 .c 知道這個名字\nextern int counter;\n\n// counter.c：真正定義一份 counter\nint counter = 0;\n```\n\n另一個 .c include 這個 header 後，就能使用同一份 counter；連結時要把 counter.c 編譯出的檔案也放進來。單寫 `extern int counter;` 並沒有新建一份 int。\n\n不要把 `int counter = 0;` 放進會被多個 .c include 的 header，否則各個 .c 都會帶入定義，連結時可能出現重複定義。Header guard 只能防同一個 .c 重複展開 header，不能替多個 .c 合併成一份物件。\n\n### 追問中的兩個例外\n\n- `extern int counter = 0;` 有初始化值，這其實是定義，不能只因為看到 extern 就說它不定義。\n- 在 **C** 中，普通的檔案層 `const int limit = 10;` 預設仍可有對外連結；**C++** 的普通檔案層 const 預設規則不同。先把這題當 C 回答，不要混用。\n\n**先記住：header 常放 extern 宣告，某一個 .c 放真正的定義。**",
    "mode": "self"
  },
  {
    "id": "C24",
    "group": "concepts",
    "title": "Does `volatile` guarantee atomicity, thread safety, or ordering between CPU memory accesses?",
    "body": "Does `volatile` guarantee atomicity, thread safety, or ordering between CPU memory accesses?\n\nFollow-up: What additional assumptions are needed when a bare-metal task and an ISR share a volatile flag?",
    "reference": "### volatile 不等於「有上鎖」\n\n它讓編譯器依平台的 volatile 規則保留相關讀寫，常見用途是會被硬體改變的暫存器，或平台約定的中斷旗標。它沒有保證兩個工作同時操作資料時一定安全。\n\n```c\nvolatile int count = 0;\n// 工作 A 和 B 都做 count++，仍然不安全。\n```\n\n因為 `count++` 可以拆成：讀取 count → 加一 → 寫回。若 A、B 都先讀到 0，最後可能都想寫入 1。這段只是幫你理解衝突；在標準 C threads 中，沒有同步的非原子衝突存取本身就是未定義行為。\n\n三個詞先這樣理解：\n\n- **Atomicity（原子性）**：某次操作不能被別人觀察成只做一半。\n- **Thread safety**：多個 thread 一起用時仍符合設計。\n- **Ordering（順序）**：另一個 CPU 或裝置看見資料的先後次序。\n\nvolatile 本身不提供這三項保證。C threads 通常用 mutex 或 C11 atomic；裝置存取則用作業系統和硬體指定的介面。\n\n### 追問：主程式和 ISR 共用旗標呢？\n\nISR 是中斷處理函式。某些裸機平台會用 volatile flag，但還要確認：一次讀寫這種寬度是否完整、旗標是否會遺失事件、是否需要暫停中斷或其他同步。不要直接套成「只要 volatile 就沒問題」。",
    "mode": "self"
  },
  {
    "id": "C25",
    "group": "concepts",
    "title": "How do a function pointer and a context pointer work together in a callback interface?",
    "body": "How do a function pointer and a context pointer work together in a callback interface?\n\nFollow-up: What happens if a deferred callback receives a context pointer to a local object whose lifetime has ended?",
    "reference": "### Callback 就是「把要執行的函式交給別人」\n\n函式指標回答「到時候呼叫誰」；context 指標回答「呼叫時，把哪份資料交給它」。\n\n```c\nvoid add_one(void *context) {\n    int *count = context;  // 這裡約定 context 指向 int\n    (*count)++;\n}\n\nvoid run_callback(void (*callback)(void *), void *context) {\n    callback(context);\n}\n```\n\n使用時：\n\n```c\nint count = 10;\nrun_callback(add_one, &count);\n// 這次呼叫結束後 count 是 11。\n```\n\n沿著程式看：run_callback 收到 add_one 的函式位址，以及 count 的位址；它執行 `callback(context)`，也就是呼叫 `add_one(&count)`。`void *` 是能承接物件位址的通用指標，沒有告訴你物件的型別，所以接收端必須依事先約定解讀。\n\n`add_one` 是把函式交出去；`add_one(...)` 則是現在就執行它，兩者不同。\n\n### 追問：如果晚一點才呼叫呢？\n\n上面的 callback 在 count 還存在時就做完，所以沒問題。若把 context 保存起來，等建立 count 的函式已返回才呼叫，context 就可能指向失效的區域變數。要讓資料活到 callback 結束，例如由呼叫者持續保存、使用適當的長期儲存，或另外複製資料並安排釋放。",
    "mode": "self"
  },
  {
    "id": "C26",
    "group": "concepts",
    "title": "Why does a positive partial-write result not necessarily mean the entire buffer was sent?",
    "body": "Why does a positive partial-write result not necessarily mean the entire buffer was sent?\n\nFollow-up: What should you do if a callback reports more bytes accepted than were offered?",
    "reference": "### 回傳正數只表示「這次接受了幾個 bytes」\n\n假設想送 `ABCDEF`，共有 6 bytes。第一次 write 回傳 2，只表示這次接受 AB，還有 CDEF 沒送完。\n\n```text\n第一次：送 ABCDEF，回傳 2 → sent = 2\n第二次：送 CDEF，回傳 3   → sent = 5\n第三次：送 F，回傳 1      → sent = 6，全部接受\n```\n\n所以下次要送的位置是 `data + sent`，剩餘長度是 `length - sent`。每次都重送 data 開頭，會把前面的資料重複送出。正確保留 sent，之後才能從中斷處接著做。\n\n這裡的「接受」可能只是進入系統緩衝區，不一定代表遠端已收到，更不代表資料已永久保存。\n\n### 追問：只交給 callback 4 bytes，它卻回傳 8？\n\n這是 callback 違反約定，不能把 sent 照加 8，應回報錯誤。也要先處理負值，再轉成 size_t；負值一旦轉成無號數，可能變成很大的正數。\n\n**P09 的特別約定：** callback 回傳 -1 代表中斷，可在剩餘額度內重試；-2 代表忙碌，先回傳讓呼叫者之後續傳；0 和其他負值是錯誤。這是題目自訂規則，不是所有 write API 都用同一套負值。",
    "mode": "self"
  },
  {
    "id": "C27",
    "group": "concepts",
    "title": "Why should a retry loop have a call budget or deadline?",
    "body": "Why should a retry loop have a call budget or deadline?\n\nFollow-up: In P09, should an interrupted call consume budget? Should a zero budget permit one initial callback?",
    "reference": "### 不設上限的重試，可能永遠出不來\n\n例如裝置一直回「現在忙」，如果你用 while 不斷重試，這個函式就可能一直占住 CPU，其他工作也沒機會進行。\n\n兩種常用限制：\n\n- **Budget（呼叫額度）**：這次最多呼叫 callback 幾次。例如額度 3，用完三次就先返回。\n- **Deadline（截止時間）**：最多等到某個時間。例如 50 ms 內還沒完成就返回。\n\n額度不是時間保證：即使只有一次呼叫，那一次如果自己卡住很久，總時間仍可能很長。真正的時間限制還要搭配可返回或可取消的底層操作。\n\n### P09 怎麼算？\n\n```text\nbudget = 2\n第 1 次：回傳 -1，中斷 → 額度剩 1\n第 2 次：回傳 -1，中斷 → 額度剩 0\n停止呼叫，保留 sent，回傳 IO_AGAIN。\n```\n\n每次實際呼叫都消耗一次，包括中斷。budget 為 0 而資料沒送完，就不能偷呼叫第一次；如果本來已經全部送完，直接回 IO_OK，也不用呼叫。\n\n**先記住：做不完可以留下進度下次繼續，不要讓一次函式呼叫無限占用時間。**",
    "mode": "self"
  },
  {
    "id": "C28",
    "group": "concepts",
    "title": "Why can mixing signed and unsigned integers produce surprising comparisons?",
    "body": "Why can mixing signed and unsigned integers produce surprising comparisons?\n\nFollow-up: Does casting a callback result to `size_t` validate that result?",
    "reference": "### 比較前，C 可能先把兩邊轉成相容的整數型別\n\n有號數可以表示負值，無號數不能。如果比較規則把負值轉成無號，結果就可能跟你直覺相反。\n\n```c\nint a = -1;\nunsigned int b = 1;\n// a < b 的結果是假。\n```\n\n這個例子裡，a 會轉成 unsigned int。-1 轉過去變成該無號型別的最大值，所以不比 1 小。要注意：不是「所有 signed/unsigned 混用都一定如此」，實際還要看兩邊型別的範圍與轉換規則。\n\n`size_t` 是用來表示大小與長度的無號整數型別，因此拿可能為負的結果去跟長度比較，特別容易出錯。\n\n### 追問：加上 cast 就是檢查了嗎？\n\n```c\nint result = -1;\nsize_t n = (size_t)result;\n```\n\n這只是轉型，沒有驗證。n 會變成很大的無號值。正確思路是先判斷 result 是否為錯誤或可重試狀態，再確認正值沒有超過允許長度，最後才轉成需要的型別。遇到大範圍的來源型別時，還要確認目標型別放得下。",
    "mode": "self"
  },
  {
    "id": "C29",
    "group": "concepts",
    "title": "Compare signed overflow, unsigned wraparound, and conversion to a narrower unsigned type.",
    "body": "Compare signed overflow, unsigned wraparound, and conversion to a narrower unsigned type.\n\nFollow-up: Does using a fixed-width typedef mean every intermediate expression is evaluated at that width?",
    "reference": "### 先看變數能放的範圍\n\n**1. 有號算術溢位：超過範圍，C11 不保證結果。**\n\n例如 `int x = INT_MAX;` 後再計算 `x + 1`，不能保證會變成最小負數。這屬於未定義行為（UB），不能靠某次電腦執行結果當規則。\n\n**2. 無號算術：超過上限會繞回。**\n\n`unsigned int` 的最大值加 1 會變成 0。可以想成只保留該型別能表示的位數，滿了就回到開頭。\n\n**3. 轉成較小的無號型別：也只保留能表示的範圍。**\n\n```c\nuint8_t a = 255;\na = a + 1;      // a 最後是 0\nuint8_t b = 300; // b 是 44，因為 300 = 256 + 44\n```\n\n這裡假設提供了 uint8_t。它能放 0～255，共 256 種值；轉回這個型別等於取除以 256 的餘數。\n\n### 追問：uint8_t 的算式都用 8 bits 計算嗎？\n\n不是。上面 `a + 1` 通常先提升成 int，算出 256，再存回 uint8_t 時變成 0。因此要分開看「中間運算型別」和「最後存入型別」。\n\n另外，超範圍的數轉成較小的 **有號** 型別，在 C11 是實作定義的結果或實作定義訊號；不要把它跟無號轉換的規則混為一談。",
    "mode": "self"
  },
  {
    "id": "C30",
    "group": "concepts",
    "title": "Why do function-like macros need parentheses around parameters and the full expression? Are parentheses enough to make a macro safe?",
    "body": "Why do function-like macros need parentheses around parameters and the full expression? Are parentheses enough to make a macro safe?\n\nFollow-up: What can go wrong when an argument has side effects? Would replacing the macro with a function always resolve unsequenced argument accesses?",
    "reference": "### 巨集會把文字直接代進去\n\n```c\n#define DOUBLE_BAD(x) x + x\n// 3 * DOUBLE_BAD(2) 展開成 3 * 2 + 2，結果是 8。\n\n#define DOUBLE(x) ((x) + (x))\n// 3 * DOUBLE(2) 展開成 3 * ((2) + (2))，結果是 12。\n```\n\n參數外面加括號，是防傳進來的算式被拆開；整個巨集外面加括號，是防它跟外面的算式混在一起。兩層括號各有用途。\n\n### 有括號仍然不代表安全\n\n`DOUBLE(i++)` 的展開中會出現兩次 i++。`++` 這種會改變資料的動作叫做副作用；在這個例子中，同一個加法內兩次修改 i 沒有規定先後，會造成未定義行為。\n\n```c\nstatic inline int twice(int x) {\n    return x + x;\n}\n// twice(i++) 只會在傳入引數時對 i 做一次 ++。\n```\n\n### 追問：換成函式就全部解決嗎？\n\n也不是。若呼叫 `f(i++, i++)`，兩個引數本身就對同一個 i 做沒有規定先後的修改，C11 仍是未定義行為。最容易檢查的寫法是先用不同敘述把值算好，再把確定的值交給函式。",
    "mode": "self"
  },
  {
    "id": "C31",
    "group": "concepts",
    "title": "Is `sizeof(struct S)` always the sum of its member sizes? Can you transmit a structure directly as a wire format?",
    "body": "Is `sizeof(struct S)` always the sum of its member sizes? Can you transmit a structure directly as a wire format?\n\nFollow-up: Would a packed structure solve both alignment and byte-order problems?",
    "reference": "### struct 成員中間可能有「空隙」\n\n```c\nstruct S {\n    char tag;\n    int value;\n};\n```\n\n在 char 為 1 byte、int 為 4 bytes 且要求 4-byte 對齊的常見平台，記憶體可能排成：\n\n```text\n位置：0    1    2    3    4    5    6    7\n內容：tag  空隙 空隙 空隙 value 的四個 bytes\n```\n\n因此 sizeof(struct S) 可能是 8，不是 1+4=5。空隙叫 **padding**；**alignment（對齊）** 是物件適合從哪些位址開始放。整個 struct 的尾端也可能補空隙，方便陣列中下一個元素對齊。確切大小要看平台，8 不是所有電腦都相同。\n\n### 為什麼不能直接把整個 struct 當封包送？\n\n接收端可能有不同的 padding、int 大小或 byte 順序。應先約定格式，例如「第 0 byte 是 tag，接下來 4 bytes 是固定順序的數值」，再逐欄轉成 bytes；這叫編碼或序列化。如此雙方才不會各自猜 struct 怎麼排。\n\n### 追問：packed 就能解決嗎？\n\nPacked 通常是編譯器提供的緊密排列方式，能減少空隙，但不能自動統一大小端；成員還可能落在未對齊位址，存取時要遵守平台規則。所以仍要先定義資料格式，不能只加 packed 就當作通訊協定完成。",
    "mode": "self"
  },
  {
    "id": "C32",
    "group": "concepts",
    "title": "Why might an API promise to leave output parameters unchanged on failure?",
    "body": "Why might an API promise to leave output parameters unchanged on failure?\n\nFollow-up: For P11, what does that promise require for both the count and the segment array?",
    "reference": "### 失敗時保留舊值，呼叫者比較不會用到半套結果\n\n假設原本的輸出是 99。你呼叫一個函式想取得新結果，結果輸入不合法；如果輸出被改成算到一半的值，呼叫者就不知道它還能不能用。\n\n```c\nbool get_value(int input, int *out) {\n    if (out == NULL || input < 0) {\n        return false;\n    }\n    int temporary = input;\n    *out = temporary;  // 確定成功後才寫回\n    return true;\n}\n```\n\n```text\nout 原本是 99\n輸入 -1 → 回 false，out 仍是 99\n輸入 7  → 回 true，out 才變成 7\n```\n\n這是函式答應的規則，稱為 **API 契約**；C 語言不會自動替你保證。常見作法是先檢查所有條件、在暫存資料裡算好，再把成功結果交出去。\n\n### P11 不只是計數要保留\n\nP11 把一段位址範圍切成數個 segment，也就是數段「起點＋長度」。若最後發現陣列只能放 1 段，但其實需要 2 段，不能先寫第一段再失敗。`*used` 和整個 segment 陣列都必須保留原樣。因此可先算需要幾格並確認容量足夠，再開始寫。",
    "mode": "self"
  },
  {
    "id": "C33",
    "group": "concepts",
    "title": "Compare stack, heap, and static storage, including typical risks.",
    "body": "Compare stack, heap, and static storage, including typical risks.\n\nFollow-up: What trade-offs arise if you move a large buffer from automatic storage to a static variable?",
    "reference": "### 先用「誰管理、活多久」區分\n\n- **Stack（堆疊）**：一般用來放函式呼叫資料與普通區域變數，通常隨函式返回自動收回。\n- **Heap（動態配置區）**：像 malloc 取得的空間，使用完通常由程式明確 free。\n- **Static storage（靜態儲存）**：全域物件、static 變數等，在整個程式執行期間存在。\n\n```c\nvoid work(void) {\n    char a[100];             // 普通區域陣列\n    static char b[100];      // 呼叫間保留同一份\n    char *p = malloc(100);   // 動態取得另一塊空間\n    // 使用 p 前要檢查是否為 NULL。\n    free(p);\n}\n```\n\na 通常在 stack，p 這個指標本身也是區域變數，但 p 指向的 malloc 空間在 heap。**指標變數放哪裡，和它指向的資料放哪裡，是兩件事。** C 標準規定的是生命週期，不強制每個編譯器用特定硬體區域；先理解這個常見實作即可。\n\n常見風險：stack 太小或遞迴太深；heap 配置失敗、忘記釋放或空間碎片化；static 資料被多個使用者共用而互相改到。\n\n### 追問：大陣列改成 static 好嗎？\n\n可減少 stack 壓力，但每次呼叫共用同一份陣列，遞迴或多個 thread 同時用時可能衝突，而且它會長期占用空間。不能只看 stack 省下多少，也要看是否允許共用。",
    "mode": "self"
  },
  {
    "id": "C34",
    "group": "concepts",
    "title": "Why should an interrupt handler usually avoid long-running work?",
    "body": "Why should an interrupt handler usually avoid long-running work?\n\nFollow-up: If it queues work for later, how should it handle a full queue?",
    "reference": "### 中斷處理像「先接住緊急通知」\n\nISR（Interrupt Service Routine）是中斷發生時執行的處理函式。例如裝置通知「有資料到了」，CPU 暫時轉去處理這件事。若在裡面做很久，其他工作或中斷就可能被延後，依平台與優先權而定。\n\n通常先做必要的事：\n\n1. 確認是哪個裝置事件，按硬體規則處理中斷狀態。\n2. 記下後續處理需要的少量資訊。\n3. 通知背景工作或放入 queue（等待處理的佇列）。\n4. 儘快返回，讓後續工作在合適的環境執行。\n\n例如接收一筆資料時，先保存緩衝區編號，之後再慢慢解析封包；不要把大量列印、長時間計算或等待其他工作都塞進 ISR。能不能呼叫某個 API，要看平台是否允許在中斷環境使用。\n\n### 追問：Queue 滿了怎麼辦？\n\n先定義策略：可以暫停來源、丟棄某些事件並累計次數，或保留一個待處理狀態。不能默默覆蓋還沒處理的資料。如果等到 queue 有空的條件依賴背景工作，而 ISR 卻一直卡著等，反而可能讓背景工作沒有機會清空 queue。",
    "mode": "self"
  },
  {
    "id": "C35",
    "group": "concepts",
    "title": "When would you use a mutex, semaphore, or spinlock?",
    "body": "When would you use a mutex, semaphore, or spinlock?\n\nFollow-up: On a single CPU, what can happen if an ISR takes the same spinlock held by the task it interrupted?",
    "reference": "### 三種同步工具，等待方式和用途不同\n\n**Mutex：同一時間，只讓一個工作進入。**\n\n例如兩個 thread 都要修改一份餘額。先取得 mutex，做完再解鎖；通常由取得它的同一個工作解鎖。等待者常可以先睡眠，讓 CPU 做其他事，具體看 OS。\n\n**Semaphore：表示還有幾份資源，或傳遞通知。**\n\n例如有 3 個可用 buffer，初值設為 3；取得一個就減一，歸還就加一。設成 1 也常用來保護共享區域，但它與 mutex 的擁有者規則不完全相同。你 EOS 的 Web ATM 就用過 System V semaphore 保護 money。\n\n**Spinlock：拿不到鎖，就持續檢查。**\n\n等待期間仍在使用 CPU，所以通常只用於非常短的區段，並遵守平台的中斷與排程規則。持有普通 spinlock 時不能去做會睡眠的操作。\n\n### 單核心 ISR 為什麼可能死鎖？\n\n```text\nTask 已拿到鎖 L。\n中斷發生，Task 被暫停，CPU 轉去跑 ISR。\nISR 也想拿 L，於是一直 spin。\nTask 沒機會繼續，也就不能釋放 L。\n```\n\n雙方卡住。解法是依平台使用能正確處理相關中斷的鎖定方式，或重新分配資料與工作；不是隨便把 mutex 換成 spinlock 就好。",
    "mode": "self"
  },
  {
    "id": "C36",
    "group": "concepts",
    "title": "What are the four necessary conditions for deadlock? How can you prevent deadlock?",
    "body": "What are the four necessary conditions for deadlock? How can you prevent deadlock?\n\nFollow-up: Draw a wait-for example where two paths acquire locks A and B in opposite orders.",
    "reference": "### Deadlock（死鎖）就是彼此等對方，誰也無法前進\n\n```text\n工作 1：已拿到 A，正在等 B。\n工作 2：已拿到 B，正在等 A。\n```\n\n兩個都不釋放已有的鎖，於是一直卡住。這個例子可以對照四個必要條件：\n\n1. **互斥**：A、B 各自同時只能由一個工作持有。\n2. **持有並等待**：拿著 A 還要等 B，或反過來。\n3. **不可強制搶走**：另一個工作不能隨便把鎖取走。\n4. **循環等待**：工作 1 等工作 2，工作 2 又等工作 1，形成一圈。\n\n「必要」的意思是：經典資源死鎖需要這些條件；不是說一看到有 mutex 就一定會死鎖。\n\n### 最容易採用的預防方式\n\n規定所有地方都先拿 A，再拿 B。這樣其中一個工作會在拿到 A 前先等，不能先占住 B 造成反向等待。另外，持鎖時少做長時間等待，也要注意 callback 是否又去拿其他鎖。\n\nTimeout 可以讓你停止等待並嘗試回復，但必須正確釋放已取得的資源；它不會自動修掉原本混亂的拿鎖順序。\n\n**面試先畫上面兩行等待關係，再逐條對應，比只背四個名詞容易說清楚。**",
    "mode": "self"
  },
  {
    "id": "C37",
    "group": "concepts",
    "title": "What does SPSC mean, and why does it simplify a queue?",
    "body": "What does SPSC mean, and why does it simplify a queue?\n\nFollow-up: Are volatile head and tail variables sufficient for synchronization between C threads?",
    "reference": "### SPSC：一個放資料的人，一個取資料的人\n\n全名是 **Single Producer Single Consumer**。Producer 負責放入，consumer 負責取出；queue 是兩者之間的資料佇列。\n\n例如感測工作把樣本放入 ring buffer，另一個工作把樣本取走。常見的 SPSC 設計讓 producer 只更新寫入位置，consumer 只更新讀取位置，因此不用處理「兩個 producer 搶同一格」的情況。\n\n但仍要安排好這個順序：\n\n```text\nProducer：先把資料寫好 → 再發布「這格可讀」。\nConsumer：確認可讀     → 再讀那格資料。\n```\n\n如果先公布新位置、資料卻還沒讓對方看見，consumer 就可能讀到不完整內容。這就是為什麼只有一寫一讀，仍需要正確同步。\n\n### 追問：head 和 tail 加 volatile 就夠了嗎？\n\n對可攜的 C threads 程式不夠。常見作法是使用 C11 atomic，搭配正確的發布／讀取規則，或使用鎖。Atomic 可先理解為語言提供的原子操作與同步工具；不必在沒理解資料流前就硬背 memory_order。\n\n如果只有同一個執行流程依序呼叫 push/pop，則是另一種較簡單的情境。也不要直接把 SPSC 演算法拿給多個 producer 用。",
    "mode": "self"
  },
  {
    "id": "C38",
    "group": "concepts",
    "title": "How do you check elapsed time across a `uint32_t` timer wrap?",
    "body": "How do you check elapsed time across a `uint32_t` timer wrap?\n\nFollow-up: Why can `now >= start + timeout` fail? Distinguish elapsed-time checks from ordering timestamps.",
    "reference": "### 無號計時器走到最大值，下一次會回到 0\n\nuint32_t 能表示 0～4294967295。假設每 1 ms 加一，走到最大值後回 0，大約 49.7 天繞一圈。\n\n想知道經過多久，通常用無號差值：\n\n```c\nuint32_t elapsed = (uint32_t)(now - start);\nif (elapsed >= timeout) {\n    // 時間到了\n}\n```\n\n例子：\n\n```text\nstart = 4294967293\n接著經過：4294967294、4294967295、0、1、2\nnow = 2\n轉成 uint32_t 的 now-start = 5，正好經過 5 格。\n```\n\n相反地，若用 `now >= start + timeout`，右邊加法可能先繞回。例如 start 是 4294967293、timeout 是 5，加完變成 2；在 start 那一刻，大數已經大於 2，反而錯判時間到了。\n\n### 使用前提\n\n真實經過時間必須小於完整一圈，並在結果失去一圈資訊前檢查。若放著兩圈才看，單靠 32-bit 數字無法知道到底繞了幾圈。timeout 和計時器也必須使用同一單位。\n\n追問中的「兩個時間戳誰比較新」是另一個問題，常需把可比較距離限制在半圈內。初學時先分清楚：這裡的程式是在算**從已知 start 經過多久**。",
    "mode": "self"
  },
  {
    "id": "C39",
    "group": "concepts",
    "title": "How can binary search avoid unsigned underflow?",
    "body": "How can binary search avoid unsigned underflow?\n\nFollow-up: Which search boundaries would you use for the strict lower and upper neighbors in P07?",
    "reference": "### size_t 沒有負數，所以別在 mid=0 時做 mid-1\n\n無號的 0 減 1 會變成非常大的數，不會變成 -1。二分搜尋若用它當索引，就可能跑到陣列外。\n\n一個好用的方式是採用 **[lo, hi) 半開區間**：包含 lo，不包含 hi。長度為 n 的陣列，一開始設 lo=0、hi=n；hi 可以在尾端外面，但不能讀 a[hi]。\n\n下面找第一個「大於或等於 key」的位置，陣列已由小到大排序：\n\n```c\nsize_t lo = 0, hi = n;\nwhile (lo < hi) {\n    size_t mid = lo + (hi - lo) / 2;\n    if (a[mid] < key) {\n        lo = mid + 1;\n    } else {\n        hi = mid;  // 不需要 mid-1\n    }\n}\n// lo 是第一個 >= key 的位置，也可能等於 n。\n```\n\n### P07 的「嚴格小於／大於」\n\n以 `[2, 4, 4, 7]`、key=4 為例：\n\n- lower_bound 是第一個 >=4 的位置，也就是索引 1；前一個值 2 是嚴格小於 4 的鄰居。先確認索引 >0，才能減一。\n- upper_bound 是第一個 >4 的位置，也就是索引 3；值 7 是嚴格大於 4 的鄰居。先確認索引 <n，才能取元素。\n\n找 upper_bound 時，迴圈的比較改成 `a[mid] <= key`。如果沒有對應鄰居，就回報不存在，不能硬取陣列前後的位置。",
    "mode": "self"
  },
  {
    "id": "C40",
    "group": "concepts",
    "title": "What makes a set of test cases convincing?",
    "body": "What makes a set of test cases convincing?\n\nFollow-up: Could you exhaustively test P02? Why would the same approach be impractical for all 64-bit inputs?",
    "reference": "### 測試要能找出不同種類的錯，不只是跑幾個順手的數字\n\n以 P02「反轉 16 個 bits」為例，可安排：\n\n- 全零：0x0000 → 0x0000。\n- 全一：0xFFFF → 0xFFFF。\n- 只有最右邊一個 1：0x0001 → 0x8000。\n- 只有最左邊一個 1：0x8000 → 0x0001。\n- 混合圖樣：0x1234 → 0x2C48。\n\n另外可檢查一個性質：反轉兩次，應得到原值。但只檢查這點還不夠，因為「完全不反轉」也會通過兩次還原，所以要搭配已知答案。\n\n### Oracle 是什麼？\n\n就是用來判斷答案對不對的依據，例如手算的例子，或另一個容易確認正確的慢速版本。測試不要只是把待測程式同一套錯誤公式再寫一次。\n\n### 追問：全部輸入都測一遍可以嗎？\n\n16 bits 只有 2^16=65536 種輸入，逐個和可靠的參考版本比對通常可行。64 bits 則有約 1.84×10^19 種；就算每秒測十億個，也要約 585 年。因此改用邊界、代表案例和性質檢查。\n\n若題目還有錯誤回傳，就再測非法參數與「失敗不改輸出」。通過測試表示這些檢查沒抓到錯，不是自動證明所有需求都正確。",
    "mode": "self"
  },
  {
    "id": "C41",
    "group": "concepts",
    "title": "Where do PCIe, NVMe, and NAND sit in a storage system?",
    "body": "Where do PCIe, NVMe, and NAND sit in a storage system?\n\nFollow-up: Is NVMe a specification of NAND read and program timing?",
    "reference": "### 先認識一筆 SSD 讀寫會碰到的角色\n\n**Host** 是使用 SSD 的電腦；**controller** 是 SSD 裡負責處理命令與管理資料的控制器。\n\n```text\n電腦上的儲存請求\n    ↓ 使用 NVMe 定義的命令\n透過 PCIe 傳送命令與資料\n    ↓\nSSD 控制器處理請求\n    ↓\nNAND 儲存資料\n```\n\n- **PCIe**：電腦與裝置之間的連接與傳輸基礎。先理解成讓兩邊交換資料的通道。\n- **NVMe**：定義儲存命令、提交與完成等規則，讓電腦和 SSD 知道怎麼交代讀寫工作。\n- **NAND**：SSD 使用的一種非揮發性記憶體，負責實際保存資料。\n\n因此「PCIe SSD 韌體」會接觸通訊、命令處理和儲存媒體管理，不是只操作一個大陣列。\n\n### 追問：NVMe 是 NAND 的寫入時序嗎？\n\n不是。NVMe 描述電腦怎麼向儲存裝置提出需求；NAND interface 則處理內部媒體怎麼讀、寫、擦除。控制器把兩端接起來。也不是所有 NVMe 都只走 PCIe，另外有其他傳輸方式；目前先把 PCIe SSD 這條路徑讀懂。\n\n**先會分：PCIe 負責傳輸基礎，NVMe 負責儲存命令規則，NAND 負責存資料。**",
    "mode": "self"
  },
  {
    "id": "C42",
    "group": "concepts",
    "title": "What are the usual responsibilities of host-facing firmware, the FTL, and the NAND interface?",
    "body": "What are the usual responsibilities of host-facing firmware, the FTL, and the NAND interface?\n\nFollow-up: Trace one host write through validation, mapping or allocation, media programming, and completion. State any architectural assumptions.",
    "reference": "### 同一筆寫入，在 SSD 內部可能分成三類工作\n\n**Host-facing 韌體**在 SSD 端對接電腦：收命令、檢查欄位、安排資料 buffer，再回報結果。這裡不是在說電腦上的 driver。\n\n**FTL（Flash Translation Layer）**是快閃記憶體轉換層：電腦要求寫「邏輯第 100 塊」，它決定資料實際放到哪個 NAND 位置，並維護對照關係。\n\n**NAND interface**負責與 NAND 媒體溝通，執行讀取、寫入、擦除與相應錯誤處理。\n\n### 用一筆寫入串起來\n\n```text\n收到「寫入邏輯第 100 塊」\n→ 檢查範圍、長度與資料位置\n→ 安排取得資料的 buffer\n→ 配置新的 NAND 儲存位置\n→ 寫入資料，處理結果\n→ 按設計更新邏輯到實體的對照\n→ 在符合命令保證後回報完成\n```\n\n這是方便學習的流程，不代表每家 SSD 都照相同模組或相同步驟切分。有些設計會先使用快取；因此什麼時候能回報完成，還要看命令和資料持久化政策，不能直接斷言「一般寫入完成就一定已進 NAND」。\n\n**先掌握分工：對外接命令、管理地址對照、對內操作 NAND。** 進階的 GC 和 wear leveling 在 C52、C54 再接著看。",
    "mode": "self"
  },
  {
    "id": "C43",
    "group": "concepts",
    "title": "What are submission queues, completion queues, and doorbells?",
    "body": "What are submission queues, completion queues, and doorbells?\n\nFollow-up: What ordering is required between publishing queue entries and notifying the device?",
    "reference": "### Queue 是放待辦或結果的佇列\n\n在常見的 PCIe NVMe 情境，電腦會在裝置可存取的記憶體中準備佇列，透過它們和 SSD 交換命令及完成資訊。\n\n- **SQ（Submission Queue）提交佇列**：Host 放入要 SSD 處理的命令。\n- **CQ（Completion Queue）完成佇列**：SSD 放入「哪筆命令做完、成功或失敗」的資訊。\n- **Doorbell**：通知對方佇列位置已更新的暫存器，不是存放整筆資料的容器。\n\n### 一次工作怎麼走？\n\n```text\nHost 先填好 SQ entry（佇列的一格）\n→ 更新 SQ tail doorbell，通知有新命令\n→ SSD 取得並處理命令\n→ SSD 放入 CQ entry\n→ Host 讀取完成結果\n→ 更新 CQ head doorbell，通知已消費哪些結果\n```\n\nTail 可理解為新增到哪裡；head 可理解為處理到哪裡。實際索引與滿空規則依 NVMe 規格。\n\n### 為什麼要管順序？\n\n如果通知已經送出，命令內容卻還沒讓裝置看見，裝置就可能讀到舊資料。因此必須讓 queue 內容先正確發布，再通知裝置；具體同步與暫存器寫法由平台規定。也可能一次放多筆命令再通知一次，不要求一筆命令一定對應一次中斷。",
    "mode": "self"
  },
  {
    "id": "C44",
    "group": "concepts",
    "title": "Why does a completion queue use a phase bit?",
    "body": "Why does a completion queue use a phase bit?\n\nFollow-up: Does a matching phase prove that the CID is valid, the request is current, and memory accesses are correctly ordered?",
    "reference": "### Ring queue 會繞回，同一格會被重複使用\n\n假設 CQ 有四格。Host 讀過第 3 格後，下一個位置又回第 0 格。但是第 0 格的記憶體可能還留著上一輪結果；不能看到「裡面有資料」就又處理一次。\n\n**Phase bit（階段位元）**用一個 0/1，配合預期值，區分這格是這輪的新結果，還是上輪留下的內容。\n\n```text\n用四格 queue 示意：\n第一輪新結果的 phase：1 1 1 1\nHost 繞回第 0 格，預期 phase 改成 0。\n此時第 0 格若仍是 1 → 舊結果，先停下。\nSSD 寫入新結果並把 phase 改成 0 → 才是這輪可消費的結果。\n```\n\n這不是說 phase 每處理一格就翻一次，而是各端按 queue 繞回的規則切換。同樣的兩種值會輪流重用，所以它也不是不會重複的完整版本編號。\n\n### 追問：Phase 對了就全部正確嗎？\n\n不夠。還要看完成資訊中的 **CID（Command Identifier，命令識別碼）** 是否對應正在等待的請求、是否屬於正確 queue，以及記憶體同步是否正確。Phase 主要解決「這格是不是新一輪」，不能取代其他檢查。P12 是用來練這個概念的簡化模型。",
    "mode": "self"
  },
  {
    "id": "C45",
    "group": "concepts",
    "title": "Explain LBA, LBA size, and NLB.",
    "body": "Explain LBA, LBA size, and NLB.\n\nFollow-up: Does P10 accept already-decoded host values or raw bytes? What must happen before calling it?",
    "reference": "### 電腦看到的儲存空間，通常按邏輯區塊編號\n\n- **LBA（Logical Block Address）**：邏輯區塊編號，像第 0、1、2 塊。\n- **LBA size**：每塊有多少 bytes，例如這次假設是 4096 bytes。\n- **NLB（Number of Logical Blocks）**：在 NVMe 相關讀寫命令中，這個欄位用「實際塊數減一」編碼。\n\n所以 NLB=0 不是不讀，而是 1 塊；NLB=1 是 2 塊；16-bit 欄位的 65535 表示 65536 塊。\n\n### 數字例子\n\n```text\n起始 LBA = 100\nLBA size = 4096 bytes\n命令中的 NLB = 1\n\n實際塊數 = 1 + 1 = 2\n讀寫的區塊 = 第 100、101 塊\n總長度 = 2 × 4096 = 8192 bytes\n```\n\nLBA 100 不代表 NAND 的實體第 100 頁，因為控制器還有地址對照與媒體管理。\n\n### 追問：P10 可以直接吃封包 bytes 嗎？\n\n不行，P10 接收的是已解碼好的整數欄位。若資料來自裝置封包，先依規定的 byte 順序解碼，再呼叫它。計算 NLB+1 時先轉成夠大的型別，例如 `(uint32_t)nlb + 1u`，避免把 65536 又塞回 16-bit 欄位而變 0。",
    "mode": "self"
  },
  {
    "id": "C46",
    "group": "concepts",
    "title": "How do you validate that an LBA range fits within a namespace without overflowing?",
    "body": "How do you validate that an LBA range fits within a namespace without overflowing?\n\nFollow-up: For a namespace containing `count` blocks, what is the last valid LBA?",
    "reference": "### Namespace 先理解成 SSD 對外提供的一個邏輯儲存空間\n\n如果它有 10 個區塊，合法 LBA 是 0～9，**不是 0～10**。題目問的是：從某處開始讀寫幾塊，會不會超出尾端？\n\n```text\n總共 10 塊：0 1 2 3 4 5 6 7 8 9\n從 8 開始讀 2 塊 → 8、9，合法。\n從 8 開始讀 3 塊 → 8、9、10，越界。\n```\n\n對正數 blocks，可以先檢查：\n\n```c\nif (slba >= count) {\n    // 起點已經不合法。\n} else if (blocks > count - slba) {\n    // 剩餘空間不夠。\n} else {\n    // 區塊範圍放得下。\n}\n```\n\n`slba` 是起始 LBA；`count` 是總區塊數。用「總量減起點」算剩多少，比先做 `slba + blocks` 更容易避免大數相加溢位；但減法前一定先確認 slba<count。\n\n### 細節\n\n若輸入是 NLB，先依 C45 解成實際塊數；0 塊的通用 API 要另外定義規則。區塊範圍合法，也不代表換算成 byte 位址與長度一定放得下；後續乘以 LBA size 時還要檢查整數範圍。\n\n**先記住：最後有效編號是 count-1，先檢查起點，再比較需要量與剩餘量。**",
    "mode": "self"
  },
  {
    "id": "C47",
    "group": "concepts",
    "title": "What is DMA? Does it eliminate all CPU involvement?",
    "body": "What is DMA? Does it eliminate all CPU involvement?\n\nFollow-up: What can an IOMMU change about device-visible addresses? What does the integer-address model in P11 leave out?",
    "reference": "### DMA：讓裝置或搬運引擎替 CPU 搬資料\n\nDMA 全名是 **Direct Memory Access**。例如 SSD 要把讀出的資料放進 Host 的 RAM，不必讓 CPU 用一個迴圈逐 byte 複製；裝置可透過 DMA 存取安排好的緩衝區。\n\n但 CPU 不是完全不做事。軟體仍要準備 buffer、建立裝置能用的地址對應、設定工作並通知裝置，最後處理完成或錯誤。\n\n### 最容易搞混的是「地址」\n\n- **CPU virtual address**：C 程式裡通常使用的位址。\n- **Physical address**：CPU 實體記憶體位址。\n- **DMA address**：交給裝置使用的位址。\n\n這三種位址在某些平台可能剛好相同，但不能一概當成同一個。**IOMMU** 是能替裝置的存取做位址轉換與限制的硬體，因此裝置看到的數字也可能不同。\n\n### 和 P11 的關係\n\nP11 只把整數位址範圍切成不跨頁的數段，並沒有真的向 OS 建立 DMA mapping（裝置可用的地址對應）。因此「把 pointer 轉成整數」或「算完頁邊界」，都不表示你已經拿到合法 DMA 位址。實作 driver 時要使用平台提供的 DMA API。",
    "mode": "self"
  },
  {
    "id": "C48",
    "group": "concepts",
    "title": "Why might coherent DMA memory still require a memory barrier?",
    "body": "Why might coherent DMA memory still require a memory barrier?\n\nFollow-up: What determines which barrier or device accessor to use? Is `volatile` enough to decide?",
    "reference": "### 一致性和順序，是兩個問題\n\n**Cache coherency（一致性）**處理 CPU 與裝置看到的資料如何保持一致。**Memory ordering（記憶體順序）**則問：不同欄位的更新，對方先看到哪一個？\n\n假設你要交給裝置一張工作單，裡面有 address、length、valid 三個欄位：\n\n```text\n先準備 address 和 length\n→ 用平台要求的同步方式發布這些欄位\n→ 最後設定 valid，表示工作單可使用\n→ 再依裝置規則通知它\n```\n\n如果裝置先看見 valid=1，address 卻還是舊值，就可能去錯的地方搬資料。因此就算是 coherent DMA memory，也不表示所有欄位自然按你想的次序被看見。\n\n### Barrier 是什麼？\n\nMemory barrier 是用來約束某些存取先後關係的同步工具；它不是「等待裝置工作做完」，也不是拿來取代鎖的萬用函式。\n\n### 追問：應該用哪個？\n\n要看 OS、CPU、DMA 記憶體種類，以及裝置暫存器的規格。正式 driver 使用指定的 barrier、DMA API 與裝置存取介面。先把「資料填好 → 發布可用 → 通知」的依賴講清楚，不要靠加 volatile 猜順序就已正確。",
    "mode": "self"
  },
  {
    "id": "C49",
    "group": "concepts",
    "title": "What problems do PRP lists and SGLs solve?",
    "body": "What problems do PRP lists and SGLs solve?\n\nFollow-up: Does virtual contiguity imply DMA contiguity? Can you obtain a valid device address by casting a pointer?",
    "reference": "### 一次 I/O 的資料，不一定在實體記憶體中連成一整段\n\nC 程式看到一段連續的虛擬地址，底下可能由幾個不同位置的記憶體頁組成。SSD 要搬資料時，就需要知道裝置實際能存取的各段位置。\n\n- **PRP（Physical Region Page）**：依 NVMe 規則描述資料頁位置，必要時使用 PRP list。\n- **SGL（Scatter/Gather List）**：用描述項列出資料區段；一般可先理解為「位址、長度等資訊的清單」，具體類型有各自規則。\n\n它們讓 controller 知道該去哪裡讀取或寫入 Host 資料，不需要假設整筆資料在一個實體連續區域。\n\n### 用 P11 的數字理解頁邊界\n\n```text\n每頁 4096 bytes\n從位址 4090 起搬 20 bytes\n第一段：4090 起，6 bytes，走到這一頁尾端\n第二段：4096 起，14 bytes\n```\n\n這只示範「不能跨頁的一段該切在哪裡」。P11 的整數範圍模型沒有做真實 DMA mapping，也沒有完整實作 PRP 的清單規則。\n\n### 追問\n\n虛擬連續不保證裝置眼中的位址也連續。把一般指標 cast 成整數，只改了 C 的型別，沒有替裝置建立存取權限或地址對應；真正可用的位置仍要透過平台 DMA 介面取得。",
    "mode": "self"
  },
  {
    "id": "C50",
    "group": "concepts",
    "title": "Why does NAND distinguish page programming from block erasure?",
    "body": "Why does NAND distinguish page programming from block erasure?\n\nFollow-up: Which geometry and timing details must come from a particular device's specifications?",
    "reference": "### NAND 不是可以隨意覆寫每個 byte 的 RAM\n\n先分兩個大小單位：\n\n- **Page（頁）**：NAND program（寫入）的基本組織單位，實際還有裝置規定的寫入限制。\n- **Block（區塊）**：由多個 pages 組成；erase（擦除）通常以整個 block 為單位。\n\n你不能一律把已寫的內容當成普通變數，想改成什麼就原地改。要重用一個 block，通常要先擦除，而整塊擦除也會影響裡面其他頁的內容。\n\n### 所以更新資料怎麼辦？\n\n```text\n舊資料在 page A\n要更新 → 找可寫入的 page B，寫入新版\n更新地址對照，讓讀取改到 B\nA 成為不再需要的舊版本\n之後再由回收機制整理空間\n```\n\n這叫 out-of-place update，可先理解成「新版寫到新位置」。它也是 FTL 和 GC 存在的重要原因，下一題再接著看。\n\n### 追問要注意什麼？\n\nPage 有多大、每個 block 有幾頁、能否部分寫入、寫入次序與讀寫時間，都要查特定 NAND 規格。不要把講義某顆晶片的數字背成所有 SSD 通用規則。Host 的 LBA size 也不必等於 NAND page size。",
    "mode": "self"
  },
  {
    "id": "C51",
    "group": "concepts",
    "title": "Why does an SSD need FTL mapping?",
    "body": "Why does an SSD need FTL mapping?\n\nFollow-up: What happens if a persistent mapping update points to data that has not been fully written when power fails?",
    "reference": "### FTL 幫電腦維持「同一個編號」，背後可以換儲存位置\n\n電腦希望覆寫 LBA 100 之後，再讀 LBA 100 就得到新版。但 NAND 不能一律像 RAM 那樣原地覆寫，因此 SSD 可把新版寫到別處，再改地址對照。\n\n```text\n原來：LBA 100 → NAND page A\n更新：把新版資料寫入 page B\n之後：LBA 100 → NAND page B\n```\n\n這個「邏輯地址 → 媒體位置」的對照叫 **mapping**。FTL 是 Flash Translation Layer，除了維護對照，也要和空間回收、耗損分散、壞區管理配合。Host 不必知道內部 page 已經改變。\n\n舊 page A 可能還留著舊資料，但對照已指向 B，因此 A 不再是目前應該讀的版本。「無效」不一定表示它已經被立即擦除。\n\n### 追問：先把對照改成 B，資料卻還沒寫好就斷電？\n\n重新開機若相信這張對照，就可能讀到不完整的 B。設計必須讓恢復後只採用符合完成條件的資料與對照，例如依裝置設計配合紀錄、版本、檢查值與提交標記。先理解核心要求：**對照不能把讀取帶到尚未完成的資料。**",
    "mode": "self"
  },
  {
    "id": "C52",
    "group": "concepts",
    "title": "What does garbage collection do in an SSD, and why can it affect latency?",
    "body": "What does garbage collection do in an SSD, and why can it affect latency?\n\nFollow-up: When free blocks are scarce, is choosing the block with the fewest valid pages the only consideration?",
    "reference": "### GC 是整理舊資料，騰出可以再寫的空間\n\nGC 全名是 **Garbage Collection**。SSD 更新資料常把新版寫到新位置，久了就有許多 block 混著「仍有效的頁」和「已過期的頁」。\n\n假設一個簡化 block 有 4 頁，其中 2 頁有效、2 頁過期：\n\n```text\n原 block：[有效 A][過期][有效 B][過期]\n先把 A、B 搬到其他位置，更新對照。\n確認搬移符合設計要求後，再擦除整個原 block。\n結果：得到一個可重新寫入的空 block。\n```\n\n不能為了拿回兩頁空間，就直接把裡面還有有效資料的整個 block 擦掉。\n\n### 為什麼影響延遲？\n\n搬移也要讀和寫，擦除也要時間；這些工作會和 Host 正在要求的 I/O 使用同一批媒體資源。平常可能很快，偶爾遇到 GC 競爭就等更久，這也是尾延遲可能變大的原因之一，不是唯一原因。\n\n### 追問：只選有效頁最少的 block 就好嗎？\n\n有效頁少通常表示需要搬的資料少，但也要考慮空 block 剩多少、各 NAND 通道目前忙不忙，以及耗損是否均衡。空間快用完時，還需要確保回收來得及供應新寫入。",
    "mode": "self"
  },
  {
    "id": "C53",
    "group": "concepts",
    "title": "How do you calculate write amplification? How does it differ from host throughput?",
    "body": "How do you calculate write amplification? How does it differ from host throughput?\n\nFollow-up: What if host writes are zero? Define the measurement interval and whether metadata writes are counted.",
    "reference": "### 電腦要求寫多少，NAND 不一定只寫那麼多\n\nHost 是使用 SSD 的電腦。除了 Host 新資料，SSD 可能還需要搬移舊資料、更新內部管理資訊，因此 NAND 實際寫入量可能更多。\n\n**WAF（Write Amplification Factor，寫入放大倍率）= NAND 寫入量 ÷ Host 寫入量。**\n\n```text\n同一段測量期間：\nHost 寫入 1 GiB\nNAND 總共寫入 3 GiB\nWAF = 3 ÷ 1 = 3\n```\n\n這表示 Host 每寫 1 份，媒體實際承擔約 3 份寫入量。常見的額外來源是 C52 的 GC 搬移。\n\n### 它和吞吐量有什麼不同？\n\n吞吐量是「每秒完成多少資料」，例如 500 MiB/s；WAF 是兩個寫入量的比例，沒有每秒的單位。WAF 較低不等於測到的速度一定較快，速度還受到其他瓶頸影響。\n\n### 追問\n\n兩個量必須取同一段期間，並說清楚是否計入管理資訊的寫入。Host 寫入量為 0 時，不能做有意義的這個除法；也不要拿一段時間的 Host 數字，除以整個裝置壽命累計的 NAND 數字。",
    "mode": "self"
  },
  {
    "id": "C54",
    "group": "concepts",
    "title": "Are wear leveling and garbage collection the same thing?",
    "body": "Are wear leveling and garbage collection the same thing?\n\nFollow-up: Does always selecting the block with the most invalid pages guarantee balanced wear?",
    "reference": "### GC 想拿回空間，Wear leveling 想分散耗損\n\n**GC（空間回收）**：搬走仍有效的資料，擦除原 block，拿回可寫空間。\n\n**Wear leveling（耗損平均）**：NAND 的擦寫壽命有限，希望不要一直反覆使用少數 block，其他 block 卻幾乎沒用到。\n\n```text\nBlock A 已擦除很多次，裡面是常更新的資料。\nBlock B 很少擦除，裡面是長期不變的資料。\n```\n\n若只讓常更新的資料一直在 A 附近改寫，A 可能提早耗損。某些策略會搬動長期不變的資料，讓較少使用的區域也能參與後續寫入；這通常稱為 static wear leveling。\n\n它們都可能用到「搬資料、更新對照、擦除」，所以實作機制會重疊，但選擇對象與主要目標不同。\n\n### 追問：每次回收過期頁最多的 block，能保證平均耗損嗎？\n\n不能。這個選法主要看需要搬多少有效資料，沒有自動考慮每個 block 已經擦過幾次。要一起看空間、搬移成本和耗損分布。\n\n**先記住：GC 解決空間問題，wear leveling 解決耗損分布問題。**",
    "mode": "self"
  },
  {
    "id": "C55",
    "group": "concepts",
    "title": "Distinguish bad-block management, ECC, and read retry.",
    "body": "Distinguish bad-block management, ECC, and read retry.\n\nFollow-up: How do factory bad blocks and runtime failures differ? Which handling rules are device-specific?",
    "reference": "### 讀資料有錯，可能需要不同層次的處理\n\n- **Bad-block management（壞區管理）**：記錄哪些 NAND block 不適合繼續可靠使用，避免再拿它們存放一般資料。\n- **ECC（Error-Correcting Code，錯誤更正碼）**：寫入時保存額外資訊，讀取時利用它偵測或修正一定範圍內的 bit 錯誤。\n- **Read retry（重新嘗試讀取）**：依媒體規則調整判讀條件，再嘗試讀出可恢復的資料。\n\n例如某頁第一次讀到少量 bit 錯誤，ECC 可能修正成功；錯誤太多時，可能嘗試 read retry。但不是任何壞掉的資料都能靠重試救回，也不能無限重試讓整個請求卡住。\n\n### 追問：出廠就壞與使用中才壞？\n\nFactory bad block 是出廠時就標記不能正常使用的 block；runtime bad block 是使用期間才發現失效或不能可靠使用的 block。如何讀取壞區標記、何時判定要隔離、舊資料怎麼救回，都要依裝置與系統規格。\n\n**先分清楚：壞區管理管位置，ECC 管資料錯誤修正，read retry 管重新判讀嘗試。** 三者會配合，但不能互相取代。",
    "mode": "self"
  },
  {
    "id": "C56",
    "group": "concepts",
    "title": "Does TRIM or deallocation immediately replace every byte with zero?",
    "body": "Does TRIM or deallocation immediately replace every byte with zero?\n\nFollow-up: What namespace properties, command guarantees, and security assumptions would you check?",
    "reference": "### TRIM／Deallocate 是說「這些邏輯資料不再需要」\n\n例如檔案系統刪除一個檔案後，可通知 SSD 某些邏輯區塊不用再保留。SSD 知道之後，回收空間時就可能不必搬移那些舊資料。\n\n這不等於收到通知的那一刻，就把對應 NAND block 立刻擦除。那個 block 也可能混著其他仍有效的資料，需要之後一起整理。\n\n### 重新讀取一定得到 0 嗎？\n\n不能不查規格就保證。Deallocated 區塊的讀取結果或錯誤行為，和裝置宣告的功能、設定及命令規則有關。要分開看「不再需要」與「讀回的 bytes 保證是什麼」。\n\n### 追問：可以拿它當安全清除嗎？\n\n不能直接當成同一件事。安全清除的需求是資料能否被恢復，還要考慮舊版本、備用區域及裝置支援的清除功能。單純通知邏輯資料不再需要，不代表所有實體副本都已消失。\n\n**先記住：Deallocate 是不再保留某段邏輯資料的通知，不是「立即寫零」的同義詞。**",
    "mode": "self"
  },
  {
    "id": "C57",
    "group": "concepts",
    "title": "What invariants matter most during recovery from a power failure?",
    "body": "What invariants matter most during recovery from a power failure?\n\nFollow-up: Does an ordinary write completion guarantee data is in NAND? What cache and durability settings affect the answer?",
    "reference": "### 斷電恢復最重要的是：不要把半套資料當成完成版本\n\n先把「持久」理解成：依裝置承諾，即使斷電後重新開機，資料仍能恢復。\n\n假設 LBA 100 原本指向 A，要更新到 B：\n\n```text\n把新資料寫到 B\n→ 確認資料符合可提交條件\n→ 保存可恢復的對照更新\n→ 按命令的持久性要求回報\n```\n\n這是說明依賴關係的簡化流程。若 B 還沒寫完整，卻先把唯一有效對照改成 B，斷電後就可能找不到完整資料。\n\n常見工具包括 log（記錄更新）、版本號、checksum（檢查資料是否損壞）、commit 標記（記錄是否已提交）。重啟時依這些資訊決定哪些更新可採用；實際順序由設計決定。\n\n### 追問：一般 Write completion 就表示資料已進 NAND？\n\n不一定。若使用 volatile write cache，也就是斷電會遺失內容的寫入快取，裝置可能先回報一般寫入完成。**Flush** 用於要求先前相關資料達到非揮發保存；**FUA（Force Unit Access）**要求這筆寫入依其規則達到非揮發保存後才完成。\n\n因此要先問快取設定、命令旗標與裝置保證，不能只看到「完成」兩字就推論斷電後一定保留。",
    "mode": "self"
  },
  {
    "id": "C58",
    "group": "concepts",
    "title": "Compare IOPS, bandwidth, latency, and tail latency.",
    "body": "Compare IOPS, bandwidth, latency, and tail latency.\n\nFollow-up: Calculate MiB/s for 32,000 IOPS at 4 KiB per I/O. Explain the units.",
    "reference": "### 這四個數字各自在問不同的事\n\n- **IOPS**：每秒完成幾筆 I/O。例如每秒完成 32000 筆讀取。\n- **Bandwidth（頻寬／吞吐量）**：每秒搬多少資料，例如 125 MiB/s。\n- **Latency（延遲）**：一筆從提出到完成花多久，例如 100 微秒。\n- **Tail latency（尾延遲）**：較慢那部分請求的延遲，常看 p99 等百分位數。\n\np99 可先理解為「約 99% 的樣本延遲不超過這個值」。它不是平均，也不是最慢的那一筆。平均很快，仍可能有少數請求等很久。\n\n### 題目的計算\n\n```text\n每筆固定 4 KiB = 4096 bytes\n32000 IOPS × 4096 bytes = 131072000 bytes/s\n1 MiB = 1048576 bytes\n131072000 ÷ 1048576 = 125 MiB/s\n```\n\n這裡 32000 是每秒筆數；KiB、MiB 是 1024 倍的單位。不要把 MiB/s 和十進位 MB/s 當成相同數字。\n\n### 注意\n\n只有在每筆大小固定時，才能直接用「IOPS × 每筆大小」換算；大小不同就要加總實際 bytes。同樣的 IOPS，4 KiB 與 1 MiB 請求代表的工作量差很多。",
    "mode": "self"
  },
  {
    "id": "C59",
    "group": "concepts",
    "title": "Does increasing queue depth always improve performance?",
    "body": "Does increasing queue depth always improve performance?\n\nFollow-up: How would you evaluate both throughput and low-depth latency when batching notifications?",
    "reference": "### Queue depth 是「同時還沒完成的請求有幾筆」\n\nQD=1 時，通常完成一筆才有下一筆；QD 較高時，可有多筆同時等待或執行。SSD 能利用不同內部資源平行處理，所以提高 QD 有時能增加吞吐量。\n\n但資源用滿之後，再塞更多工作，可能只是排隊更久：\n\n```text\nQD 小：資源沒用滿，增加請求可能更快。\nQD 已足夠：接近裝置能力上限。\nQD 再增加：完成速度未必增加，等待時間卻可能拉長。\n```\n\n所以「總共每秒做得多」和「單筆等得短」不能畫上等號，實際瓶頸也要量測確認。\n\n### 追問：把通知集中一批送會怎樣？\n\n批次通知可以減少通知次數與成本，但第一筆可能先等在那裡，直到湊到一批或時間到才送。測試時要同時看高 QD 的吞吐量，以及低 QD 的延遲與 p99，不能只報最好看的指標。\n\n比較時固定讀寫比例、I/O 大小、測試版本和溫度等條件，再畫出不同 QD 的結果，才知道變化來自哪裡。",
    "mode": "self"
  },
  {
    "id": "C60",
    "group": "concepts",
    "title": "A customer reports occasional timeouts. What would you ask and measure first?",
    "body": "A customer reports occasional timeouts. What would you ask and measure first?\n\nFollow-up: Is it safe to free a DMA buffer as soon as a timeout expires? Describe the stop or cancellation guarantee you need.",
    "reference": "### Timeout 只是「等超過期限」，還不知道卡在哪裡\n\n先把一筆請求分成幾站：\n\n```text\nHost 提交 → SSD 收到 → 內部處理／媒體存取\n→ 寫入完成佇列 → Host 看到並處理完成\n```\n\n先問裝置型號、韌體與 driver 版本、作業系統、什麼讀寫情境、多久出現一次，是否伴隨高溫、reset 或其他錯誤。再用時間與請求編號對照各站紀錄，找出最後確認走到哪一步。\n\nCID 是命令識別碼；queue 編號則區分是哪個佇列。兩者搭配時間線，才比較不會把不同請求的紀錄混在一起。盡量縮成可重複的小測試；某站沒紀錄也可能只是沒加到 log，不能立刻認定硬體沒做。\n\n### 追問：Timeout 到了，可以立刻 free DMA buffer 嗎？\n\n不行。逾時只代表軟體不想再等，裝置可能還在往那塊空間寫。如果先 free，空間被別人拿走後，裝置就可能破壞別人的資料。\n\n必須先透過平台規定的取消、停止或 reset 流程，確認裝置不會再存取，並處理可能晚到的完成通知，再解除對應與回收。重點是取得「已停止使用 buffer」的保證，不是單純多睡幾毫秒。",
    "mode": "self"
  },
  {
    "id": "C61",
    "group": "concepts",
    "title": "How would you explain the hardest bug you have solved in one of your projects?",
    "body": "How would you explain the hardest bug you have solved in one of your projects?\n\nFollow-up: Give a reproducible example, your own contribution, the root cause, and evidence that the correction worked.",
    "reference": "### 不需要挑聽起來最厲害的 bug，要挑你能說清楚的\n\n用下面的順序整理一個自己真的遇過的案例：\n\n1. 原本要做什麼？輸入與預期結果是什麼？\n2. 實際錯在哪裡？怎麼穩定重現？\n3. 你看了哪些輸出、資料或波形？原先懷疑什麼？\n4. 找到的真正原因是什麼？你負責改哪一段？\n5. 怎麼證明改好？原本的重現方式是否通過？其他情境有沒有被影響？\n\n例如短寫入這類問題，可以畫出「要送 6 bytes、第一次只接受 2 bytes」的過程，解釋為什麼下次必須從第 3 byte 繼續。但只有你真的做過與確認過，才能把它說成自己的除錯經驗；單純讀懂題目，應說是練習學到的觀念。\n\n### 怎麼選自己的材料？\n\n可回看 EOS 七段顯示器的字元到 GPIO 對照、Web ATM 的共享餘額，或 CA 的相依與 Cache 測試，挑你記得的實際問題。先寫下能找到的程式位置與展示紀錄，沒有確認的部分就明說要查。\n\n**先講可重現的現象和原因，再講修正證據。** 不必用一堆術語，也不需要編造加速百分比或量產經驗。",
    "mode": "self"
  },
  {
    "id": "C62",
    "group": "concepts",
    "title": "How would you avoid a misleading performance-improvement claim?",
    "body": "How would you avoid a misleading performance-improvement claim?\n\nFollow-up: Can one best run, or a change in I/O size followed by an IOPS comparison, establish an improvement?",
    "reference": "### 要說「改了之後比較快」，先確定比較的是同一件事\n\n假設修改前用 4 KiB 隨機讀，修改後用 1 MiB 連續讀，就算速度變高，也不能直接說是程式修改造成的，因為測試工作已經換了。\n\n比較前後時，盡量固定：\n\n- 同一套硬體、韌體／程式版本差異與設定。\n- 相同 I/O 大小、讀寫比例、存取模式和 QD。\n- 類似的溫度、背景工作與裝置狀態。\n- 相同的量測範圍，重複多次，保留每次結果。\n\nWarmup 是先讓系統進入測試狀態的暖機階段；steady state 是行為相對穩定的階段。它們的數字可能不同，不要把某一次最漂亮的瞬間值當成一般表現。\n\n### 追問：只挑最佳一次可以嗎？\n\n不適合當唯一證據。至少要看多次結果是否一致，也要看平均和較慢的情況。加 log 或量測工具本身可能拖慢程式，也要留意。\n\n你 Lab 2 的前後 sysbench 紀錄可以說「當次觀察到這些數字」，若沒有多次控制條件的測量，就先不宣稱已證明穩定提升。確認資料正確也要先於速度比較。",
    "mode": "self"
  },
  {
    "id": "C63",
    "group": "concepts",
    "title": "What do the preprocessor, compiler, and linker each do?",
    "body": "What do the preprocessor, compiler, and linker each do?\n\nFollow-up: Why can a declared function still cause a linker error? Can another translation unit directly link to a static function?",
    "reference": "### 一個 .c 變成可執行檔，中間分好幾個工作\n\n**1. Preprocessor（前處理器）**：處理 #include、#define 等。例如把 header 內容帶進來、展開巨集。\n\n**2. Compiler（編譯器）**：檢查 C 語法與型別，轉成後續機器碼生成所需的形式。工具鏈通常還有 assembler（組譯器）產生 .o 目的檔；初學先知道 .o 還不是完整的執行檔。\n\n**3. Linker（連結器）**：把多個 .o 和需要的函式庫接起來，替跨檔案呼叫找到真正的函式。\n\n```c\nint add(int a, int b); // 只有宣告，還沒提供函式內容\nint main(void) {\n    return add(1, 2);\n}\n```\n\n編譯器知道 add 怎麼呼叫，因此這部分可編譯。如果整個連結過程都找不到 add 的實作，就可能出現 **undefined reference**：名字有宣告，但找不到能接上的實作。\n\n若連宣告都沒有，則是另一種編譯階段的問題，例如 undeclared identifier 或缺少函式宣告的診斷。不要把所有錯誤都叫做語法錯。\n\n### 追問：別的 .c 能直接呼叫 static 函式嗎？\n\n不能靠宣告同名函式直接外連。檔案層 static 函式限制了對外連結；需要開放使用，就應設計適當的對外函式介面。",
    "mode": "self"
  },
  {
    "id": "C64",
    "group": "concepts",
    "title": "An interviewer asks for a faster algorithm than your first solution. How do you respond?",
    "body": "An interviewer asks for a faster algorithm than your first solution. How do you respond?\n\nFollow-up: Explain the correct baseline, identify the bottleneck, and state what assumptions you would verify before optimizing.",
    "reference": "### 先說清楚正確版本，再討論怎麼省工作\n\n你可以先回答：「我先確認目前版本的正確性，再看主要成本在哪裡，以及是否能利用輸入的特性。」\n\n例如要找某數的相鄰值：\n\n- 如果陣列沒有排序，先掃描全部元素是合理的基本版本。\n- 如果題目已保證排序，可以考慮二分搜尋，減少要看的位置。\n- 如果原本沒排序，為了只查一次就先排序，也有排序成本，未必划算。\n\n**時間複雜度**是在描述輸入變大時工作量怎麼成長；**空間複雜度**描述額外儲存需求。不是只背 O(n)、O(log n)，還要說為什麼需要看那些資料。\n\n### P02 可以怎麼回答？\n\n先說明逐 bit 取出、放到反方向的正確版本。被問更快時，可研究分組交換 bits 或平台指令，但要檢查邊界和可攜性。固定 16-bit 的兩種方法都可視為固定工作量，仍可能有實際指令數差異；不要硬說換寫法就一定改善複雜度。\n\n### 不知道更快方法時\n\n可以說你會先確認輸入上限、是否允許額外記憶體、資料是否已排序，以及會重複查幾次。提出可驗證的方向，比直接猜一個沒有想清楚的答案更好。",
    "mode": "self"
  },
  {
    "id": "D01",
    "group": "debugging",
    "title": "Full-width masks and validation order",
    "body": "```c\nuint64_t field(uint64_t reg,unsigned offset,unsigned width,uint64_t v){\n    uint64_t mask=((UINT64_C(1)<<width)-1)<<offset;\n    if(offset+width>64) return reg;\n    return (reg&~mask)|(v<<offset);\n}\n```\n\nThe intended behavior is P01. Find at least four inputs that violate its requirements. For each, identify the first incorrect operation.",
    "reference": "width64已shift64；width>64／offset64亦非法；offset+width可wrap；value太大會汙染欄位外；width0未拒絕。先驗width1..64及offset<=64-width，單獨處理width64，驗value<=low，最後才合成。\n\n**測試／追問：** 反例：width64/offset0；width0；width1/offsetUINT_MAX；width4/value16。assert失敗不改out，且欄位外bits保持。",
    "mode": "self"
  },
  {
    "id": "D02",
    "group": "debugging",
    "title": "Allocation-size overflow",
    "body": "```c\nvoid *new_items(size_t count){\n    size_t bytes=count*sizeof(uint32_t)+16;\n    if(bytes>SIZE_MAX) return NULL;\n    return malloc(bytes);\n}\n```\n\nWhat can happen if the size calculation wraps but the caller still writes `count` elements? Explain why the check is ineffective and show how to validate each arithmetic step.",
    "reference": "size_t結果永遠不會大於SIZE_MAX；乘／加可能已wrap。先count>SIZE_MAX/sizeof(uint32_t)，再product>SIZE_MAX-16。malloc還會失敗；count0是否仍配置header需明定。超界寫不是malloc的錯。\n\n**測試／追問：** count=SIZE_MAX/4+1測乘法；接近SIZE_MAX-16測header加法；分開測合法size算完但allocator失敗。",
    "mode": "self"
  },
  {
    "id": "D03",
    "group": "debugging",
    "title": "Overlapping moves and unsigned loops",
    "body": "```c\nvoid move_right(uint8_t *b,size_t dst,size_t src,size_t n){\n    for(size_t i=0;i<n;++i) b[dst+i]=b[src+i];\n}\n/* Proposed fix */\n/* for(size_t i=n-1;i>=0;--i) ... */\n```\n\nGive an overlapping input that the forward loop corrupts. What is wrong with the proposed reverse loop in the comment?",
    "reference": "向右重疊正向copy會讀到已覆蓋資料。size_t i>=0永遠成立；n0時n-1下溢。用i=n，while(i>0){--i;...}，並按P04先驗容量與offset。\n\n**測試／追問：** [0,1,2,3] src0,dst1,n3預期[0,0,1,2]；n0、src==dst、無重疊也需測。",
    "mode": "self"
  },
  {
    "id": "D04",
    "group": "debugging",
    "title": "Skipped list nodes",
    "body": "```c\nnode_t *drop(node_t *head,int target){\n    node_t *p=head;\n    while(p && p->next){\n        if(p->next->value==target) p->next=p->next->next;\n        p=p->next;\n    }\n    return head;\n}\n```\n\nEvaluate this function against P08. Consider matching head nodes, consecutive matches, and the next pointer of each removed node.",
    "reference": "永遠不檢查head本身；移除後又前進可漏掉連續目標；沒清掉移出next。按連結位置遍歷，移除後留在當前link再檢查新接上的node。不得擅自free caller節點。\n\n**測試／追問：** 7→7→2、2→7→7→3、全7、空list；驗原保留節點地址與所有移出nextNULL。",
    "mode": "self"
  },
  {
    "id": "D05",
    "group": "debugging",
    "title": "Packet casts and length checks",
    "body": "```c\nbool parse_bad(const uint8_t *b,size_t count,packet_view_t *out){\n    uint16_t len=*(const uint16_t *)(b+2);\n    if(count<8+len) return false;\n    out->payload=b+8; out->length=len;\n    return true;\n}\n```\n\nEvaluate this function against P05. Consider null pointers, short headers, byte order, alignment, reserved bits, trailing data, output fields, and the lifetime of the borrowed payload.",
    "reference": "未驗輸入就讀；typed cast不保證alignment／aliasing、依賴host endian；只判少於不判多餘；沒驗opcode/flags/sequence；未驗out。改為header檢查→逐byte decode→全部契約驗證→local result提交。view有效期仍需caller保證。\n\n**測試／追問：** count0..7、unaligned source、length1/count10、upperflags非0、原buffer變動測借用。",
    "mode": "self"
  },
  {
    "id": "D06",
    "group": "debugging",
    "title": "Converting callback results too early",
    "body": "```c\nio_result_t send_bad(write_fn fn,void *ctx,const uint8_t *p,size_t n,size_t *sent){\n    *sent=0;\n    while(*sent<n){\n        size_t k=(size_t)fn(ctx,p+*sent,n-*sent);\n        if(k==0) return IO_ERROR;\n        *sent+=k;\n    }\n    return IO_OK;\n}\n```\n\nFind at least five ways this function fails the P09 contract. Which issues involve conversion to `size_t`, and which require changes to control flow or validation?",
    "reference": "負值變巨大unsigned，無法正確分類-1/-2；sent每次歸0毀續傳；未驗指標／sent範圍；無budget可卡住；沒驗overreport與加法邊界。cast不是驗證，先保持int分類，確認正值<=remaining後再轉。\n\n**測試／追問：** 2,-2再續傳；全-1限制callback次數；0、-3、remaining+1；sent>length及budget0不呼叫。",
    "mode": "self"
  },
  {
    "id": "D07",
    "group": "debugging",
    "title": "Unsigned binary-search indices",
    "body": "```c\nsize_t find_bad(const int *a,size_t n,int key){\n    size_t lo=0,hi=n-1;\n    while(lo<=hi){\n        size_t mid=(lo+hi)/2;\n        if(a[mid]==key) return mid;\n        if(a[mid]>key) hi=mid-1; else lo=mid+1;\n    }\n    return n;\n}\n```\n\nWhat happens for an empty array, a key smaller than the first element, and very large indices? Explain the risks and propose safe search bounds.",
    "reference": "n0時n-1下溢；mid0時mid-1下溢；lo+hi可能overflow。用半開[lo,n)，mid=lo+(hi-lo)/2，更新hi=mid或lo=mid+1。最後驗index與值；P07需要兩種bound而非任一equal。\n\n**測試／追問：** n0、n1、key在兩端之外、重複值、INT_MIN/MAX。別為修下溢把size_t全cast成可能放不下的int。",
    "mode": "self"
  },
  {
    "id": "D08",
    "group": "debugging",
    "title": "Lost updates on a volatile counter",
    "body": "```c\n/* Platform pseudocode, not portable C thread synchronization */\nvolatile unsigned completed;\n/* task */ completed++;\n/* ISR  */ completed++;\n```\n\nEven if the platform guarantees atomic unsigned loads and stores, can an increment be lost? Show an interleaving between the task and ISR.",
    "reference": "++是讀→計算→寫，task讀0後ISR讀0寫1，task再寫1，兩個event只計1。volatile不把RMW合成原子。用平臺允許的短IRQ mask／atomic RMW／單寫者queue；需考慮多核與ISR可用API。\n\n**測試／追問：** 以可控插入中斷測丟event；compiler assembly觀察只是證據，最終依平臺memory/atomic約定。C threads若共享非atomic則還有data race UB。",
    "mode": "self"
  },
  {
    "id": "D09",
    "group": "debugging",
    "title": "Freeing a DMA buffer after a timeout",
    "body": "```c\n/* Device API pseudocode */\nbuf=allocate_dma(); submit(device,buf);\nif(wait_completion(device,10)==TIMEOUT){\n    free_dma(buf); return ERROR;\n}\n```\n\nWhy does a timeout not prove that the device has stopped accessing the buffer? Define the ownership states and the conditions for safe reclamation.",
    "reference": "timeout只說明等待超過時間；device仍可能讀寫buf。回收後device可寫入被複用的記憶體。需cancel/quiesce/reset協議並確認device不再訪問，再做mapping同步／unmap與free。把任務所有權、device所有權和遲到completion列成狀態機。\n\n**測試／追問：** fake-device在timeout後延遲completion／DMA；取消失敗、reset中、重試CID複用都需測。真實memory-order/cache須實機或平臺模型。",
    "mode": "self"
  },
  {
    "id": "D10",
    "group": "debugging",
    "title": "Trusting phase and CID alone",
    "body": "```c\n/* Simplified pseudocode */\nwhile(cq[head].phase==phase){\n    finish(cq[head].cid);\n    head=(head+1)%depth;\n}\n```\n\nHow could this loop repeatedly process old entries or complete the wrong request? Which part of the problem does the P12 model address, and what does it leave out?",
    "reference": "wrap沒有切phase可重讀舊slot；無depth/容量預算；沒驗depth0；finish沒檢查CID是否outstanding、queue與reset世代。P12只解簡化ring消費；真正協議還需要同步、CID lifecycle與異常處理。\n\n**測試／追問：** depth1、wrap、stale entry、重複CID、reset後late completion。generation token若不在硬體回傳欄位就不能憑軟體憑空識別。",
    "mode": "self"
  },
  {
    "id": "D11",
    "group": "debugging",
    "title": "Partial output before a capacity failure",
    "body": "```c\nbool split_bad(uint64_t addr,uint64_t n,uint32_t page,\n               segment_t *s,size_t cap,size_t *used){\n    *used=0;\n    while(n){\n        if(*used==cap) return false;\n        uint32_t k=page-(uint32_t)(addr%page);\n        if(k>n) k=(uint32_t)n;\n        s[*used]=(segment_t){addr,k}; ++*used;\n        addr+=k; n-=k;\n    }\n    return true;\n}\n```\n\nEvaluate this function against P11. Identify problems beyond insufficient capacity. Why is telling the caller to ignore the output on failure insufficient for the stated contract?",
    "reference": "false之前已改used/array違約；page0會除0；沒驗power2、NULL、addr+noverflow。先驗全部基礎條件、預估需要段數、確認cap再寫。對P11失敗不改輸出是明確需求，不能偷偷換契約。\n\n**測試／追問：** cap少一且array先填sentinel，檢查整塊memcmp不變；addr近MAX、length0/pagesize0。",
    "mode": "self"
  },
  {
    "id": "D12",
    "group": "debugging",
    "title": "Publishing a mapping before programming data",
    "body": "```c\n/* Simplified FTL pseudocode */\nnew_page=reserve_page();\nmap[lba]=new_page; persist_map();\nprogram_data(new_page,data);\ncomplete_host_write();\n```\n\nConsider a power failure between each pair of operations. What might recovery find? State the required durability guarantees and propose a safe persistence order.",
    "reference": "mapping先持久化可能指向未program完整的新page。可採資料寫入確認→記錄mapping日誌含版本／checksum→commit→依durability policy完成→稍後checkpoint；恢復忽略不完整commit並保留舊版本。真實NANDprogram完成、flush/FUA與PLP約定要明示。\n\n**測試／追問：** 故障注入每個步驟前後，斷電恢復後應讀舊版或承諾的新完整版本，不應混合／損毀；重複recovery需冪等。",
    "mode": "self"
  },
  {
    "id": "A01",
    "group": "advanced",
    "title": "Reverse 32 bits without a loop",
    "body": "Write a bit-reversal function for `uint32_t`. Start with a correct loop, then replace it with a fixed sequence of swaps between adjacent groups of 1, 2, 4, 8, and 16 bits. Do not use strings, a 256-entry lookup table, or compiler builtins.\n\nExamples: `0x00000001 -> 0x80000000`; `0x01234567 -> 0xE6A2C480`.",
    "reference": "先說每輪交換哪些位置；所有mask是unsigned，最後交換兩半。驗證固定例子、reverse(reverse(x))==x，再以迴圈oracle比對大量固定seed輸入；32-bit全窮舉成本很高。編譯器builtin可作平臺替代，但不是這題限制下的答案。",
    "mode": "self"
  },
  {
    "id": "A02",
    "group": "advanced",
    "title": "Highest set bit and population count",
    "body": "For a `uint64_t`, return the zero-based index of the highest set bit. For zero, return `false` without changing the output. Also implement population count.\n\nStart with O(64) implementations, then propose a binary-search approach for the highest bit and an `x &= x - 1` approach for population count. Do not use floating-point logarithms. For `0x10`, the highest index is 4 and the population count is 1.",
    "reference": "零值先特判，否則會把不存在的bit當0；binary partition依高半有無1縮小，popcount低1清除每次減少一個setbit。O(log w)找highest，popcount O(1的數量)；驗0、最高bit、全1。builtin clz對0的定義依compiler介面，不可盲調。",
    "mode": "self"
  },
  {
    "id": "A03",
    "group": "advanced",
    "title": "Reserve a run across bitmap words",
    "body": "Extend P03 to `uint64_t words[4]`. Only bits 0 through `limit - 1` are available, with `limit` from 1 to 256 and `needed` from 1 to `limit`.\n\nReserve the free run with the lowest starting index, allowing it to cross word boundaries. Mark the entire run on success. On failure, leave all words and the starting-index output unchanged. Include a case where bits 63 and 64 form a two-slot run.",
    "reference": "最簡單按bit維護當前連續零計數，達到needed時記起點；確定後再提交。O(limit)，跨word用index/64與index%64；最後word未有效bits不能誤分配。若併發需整體鎖或明確多word事務協議，單個word CAS無法自動保證跨word原子。",
    "mode": "self"
  },
  {
    "id": "A04",
    "group": "advanced",
    "title": "Closest pair from two sorted arrays",
    "body": "Given two nondecreasing arrays of `int`, return one index from each array and their absolute difference as a `uint64_t`. Find the smallest difference; break ties by the lexicographically smallest `(indexA, indexB)`.\n\nSupport duplicates and `INT_MIN`/`INT_MAX`. Do not modify the inputs. Use O(n + m) time. If either array is empty, return `false` without changing the output.",
    "reference": "雙指標比較當前值，推進較小一側，差以int64_t先提升後減再取絕對值。在差相等時顯式比較indices，差0也不能未經tie契約就任意返回。可先壓縮重複值到最早index或證明遍歷不會漏最早候選。與O(nm)oracle比對小陣列。",
    "mode": "self"
  },
  {
    "id": "A05",
    "group": "advanced",
    "title": "A C11 SPSC queue",
    "body": "Design an eight-element queue for one producer thread and one consumer thread. Use monotonic unsigned `uint32_t` head and tail counters with C11 atomics. Counters may wrap. Do not use dynamic allocation or a mutex.\n\nA push on a full queue returns `false` without changing the queue. A pop on an empty queue returns `false` without changing its output. Explain the memory ordering while both threads run continuously.",
    "reference": "producer讀自己的head，acquire讀tail後驗head-tail<8，再寫payload並release釋出head；consumer acquire讀head判斷非空，讀payload後release釋出tail。對方acquire tail亦保護slot複用。own counter可relaxed；maintain unsigned distance≤8，不能把32-bit counter直接signed比較。先寫順序模型，再stress／TSan（工具可用時）；ASan不證明併發correct。",
    "mode": "self"
  },
  {
    "id": "A06",
    "group": "advanced",
    "title": "Request pool with generation handles",
    "body": "Design a fixed pool of 16 requests. Each slot has state `FREE`, `ACTIVE`, or `DONE`. Allocation returns an `(index, generation)` handle.\n\nAfter a slot is released and reused, its old handles must be invalid. Invalid operations must not change the pool. Define a policy for generation wraparound.",
    "reference": "驗證index範圍與generation匹配後才改狀態；每次recycle提升generation，不能只驗index。generation有限會wrap，需限制舊handle lifetime或quarantine／epoch策略。若多thread需鎖／atomic狀態協議。這是軟體handle題，不能假定硬體CQE也會回generation。",
    "mode": "self"
  },
  {
    "id": "A07",
    "group": "advanced",
    "title": "Partial writes with deadlines and cancellation",
    "body": "Extend P09 with a total deadline and cancellation, keeping the per-call budget separate. Use a `uint32_t` tick counter and deadlines less than `2^31` ticks away. A unit of work must not block indefinitely.\n\nKeep `sent` cumulative. Cancellation preserves progress and stops further callback invocations. Bytes already accepted cannot be taken back. State the timer-wrap and callback-blocking assumptions.",
    "reference": "以elapsed=now-start判限時，契約限定真實經過不超計時器一個完整週期；每次callback前判cancel/deadline，每次返回後存進度。說明cancel與completion同刻優先順序；回撥需要有界時間。寫全-1、全-2、time wrap、部分進度cancel測試。重試必須知道接收端是否容許重複。",
    "mode": "self"
  },
  {
    "id": "A08",
    "group": "advanced",
    "title": "Duplicate and unknown completion IDs",
    "body": "Model a four-entry request table where a completion returns only a CID. Handle normal, unknown, duplicate, late-after-timeout, and reused-after-reset cases.\n\nDo not assume the device returns a generation field. Define when it is safe to reuse a CID and its buffer, and identify cases that cannot be distinguished from the CID alone.",
    "reference": "記錄CID是否outstanding及queue／reset生命週期；unknown或duplicate需錯誤策略與日誌。timeout不表示舊命令終止；若相同CID已給新請求，遲到CQE可能無法區分。必須quiesce／drain/reset或有協議保證才複用；軟體generation有幫助但缺回傳資訊時無法單憑它判定舊CQE。",
    "mode": "self"
  },
  {
    "id": "A09",
    "group": "advanced",
    "title": "Queue reset state machine",
    "body": "Design a state machine with `RUNNING -> QUIESCING -> RESETTING -> REINIT -> RUNNING`, plus failure exits.\n\nStop accepting new requests once reset begins. Define how to wait for or terminate in-flight requests, recover DMA ownership, handle late completions, and initialize doorbells and completion queues.",
    "reference": "按平臺reset保證確定停止點，只有裝置不能再訪問才unmap/free；queue生命週期與request生命週期分開。重新初始化head/tail/phase及硬體暫存器順序依spec。對重複reset／reset中submit／reset失敗／late interrupt做故障注入；不能只清軟體head就假定硬體跟著停。",
    "mode": "self"
  },
  {
    "id": "A10",
    "group": "advanced",
    "title": "Validate a descriptor batch before writing output",
    "body": "Validate a batch of at most 32 custom descriptors, each containing an address, length, and flags.\n\nRequire nonzero lengths, address ranges without overflow, zero reserved flag bits, and a total length no greater than a supplied budget. If any descriptor is invalid, leave the entire output and count unchanged. Do not allocate memory.",
    "reference": "先驗證全部並計算count/總量，區域性固定陣列或第二次遍歷提交。若輸入在兩次之間可被另執行緒修改，需鎖、snapshot或ownership；const僅限制本函式不能寫，不保證別人不改。測試錯誤在首／中／末項及失敗sentinel。",
    "mode": "self"
  },
  {
    "id": "A11",
    "group": "advanced",
    "title": "Choose a garbage-collection victim",
    "body": "In this model, each block has 64 pages and fields `valid`, `invalid`, `erase_count`, and `busy`. A candidate must not be busy and must have at least one invalid page.\n\nChoose the candidate with the fewest valid pages, then the lowest erase count, then the lowest index. For `(20,44,100,false)`, `(4,60,200,false)`, and `(4,60,150,false)`, choose index 2. Explain the selection cost and the model's limitations.",
    "reference": "先明定欄位一致valid+invalid≤64（剩餘空頁），驗所有輸入後才輸出；依lexicographic評分穩定挑選。O(n)掃描足夠。追問實際GC不能只按這條規則，需要空block預留、資源競爭與wear。這只是選victim模型，不是聲稱真實controller策略。",
    "mode": "self"
  },
  {
    "id": "A12",
    "group": "advanced",
    "title": "Recover an FTL log after power loss",
    "body": "A simplified log record contains `(sequence, lba, new_page, checksum, commit)`. Recover only records with a valid checksum and a complete commit marker. For the same LBA, the highest sequence wins.\n\nDefine the persistence order for data, log records, commit markers, and checkpoints. Show the recovery result for a power failure at each step.",
    "reference": "必須先定義原子寫粒度、flush與持久化屏障；checksum只偵測損毀不能保證commit原子。data完成→log body→commit→承諾durable completion；checkpoint前保留必要log。replay冪等、sequence overflow需epoch策略。未提交新頁作為orphan回收，保留舊map。真實NAND錯誤處理另建模。",
    "mode": "self"
  },
  {
    "id": "A13",
    "group": "advanced",
    "title": "An NVMe command-validation checklist",
    "body": "Create a layered validation checklist for host reads and writes: opcode, namespace and format, SLBA and NLB, buffer descriptions and DMA, queue resources, and completion status.\n\nYou do not need to implement the full specification. Separate version- or capability-dependent requirements from general integer and bounds checks.",
    "reference": "先查正確command和能力，不能套P05教學header；LBA byte轉換對應P10但實際format範圍以spec為準。PRP/SGL合法性、mapping長度、reserved bits與能力支援要逐層驗。一般減法bounds／升寬NLB可跨平臺；命令錯誤status應按規範，不用任意bool替代裝置返回碼。",
    "mode": "self"
  },
  {
    "id": "A14",
    "group": "advanced",
    "title": "Performance units and Little's law",
    "body": "At a fixed I/O size of 4 KiB and 32,000 IOPS, calculate MiB/s.\n\nFor a stable workload with an average of eight requests in flight and an average latency of 250 microseconds, estimate IOPS. If p99 latency is 4 ms, can you substitute it for the average? State the assumptions behind your calculation.",
    "reference": "第一題125MiB/s。Little's law穩態L=λW，8/0.00025=32,000IOPS；L需實際平均系統內請求，不是標稱最大QD。p99不是平均W，不能替代；同測量邊界、穩態與無遺漏等前提要講清楚。",
    "mode": "self"
  },
  {
    "id": "A15",
    "group": "advanced",
    "title": "Investigate a tail-latency regression",
    "body": "The p99 latency rises sharply only after ten minutes of sustained random writes. A short read test does not reproduce the problem.\n\nGive at least three hypotheses and propose logs or experiments that distinguish them. Explain how you would reduce the chance that instrumentation changes the timing being investigated.",
    "reference": "假說可含GC／空block壓力、熱限制、媒體retry、host排程／interrupt聚合。固定QD與大小，記錄資源／溫度／retry／各階段時間戳，分離host與device時鐘；改變單一條件檢驗假說。logging會擾動時序，用取樣／低開銷環形事件並檢查啟用前後。不能僅憑症狀確定GC。",
    "mode": "self"
  },
  {
    "id": "A16",
    "group": "advanced",
    "title": "Explain your own project",
    "body": "Choose a project you actually worked on. Draw its inputs, parsing and state changes, and outputs. Identify ownership, error recovery, tests, your contribution, and the main limitation.\n\nNow change the requirements: input buffers may be reused, callbacks may run later, or writes may accept only two bytes at a time. Which interfaces and lifetime guarantees must change?",
    "reference": "把功能與借用資料的生命週期講具體；延遲callback必須持有資源／複製、複用buffer前需確認消費完成；partial write儲存進度並分類可重試狀態。面試加分來自可解釋的決策與證據，不是將教學測試包裝成量產SSD經驗。",
    "mode": "self"
  },
  {
    "id": "M-A",
    "group": "mocks",
    "title": "Mock A: C, memory, and error handling",
    "body": "Time: 120 minutes. You may split the first attempt into two 60-minute sessions. Use the supplied declarations, problem statements, and a compiler, but do not consult answers or search for solutions. Explain your approach before coding and record any hints you need. This is a practice session, not a company's interview format.\n\n## 0–10 minutes: Introduction and project discussion (10 points)\n\nIntroduce yourself in 90 seconds, then discuss a feature you completed.\n\n- Which part did you implement? What were its inputs and outputs?\n- Describe a bug: reproduction, root cause, correction, and verification.\n- For the ITRI gripper work, how did force and angle requirements become settings and tests? If you cannot recall an interface or number, identify the document you would check.\n\n## 10–25 minutes: Reading and concepts (20 points)\n\nAnswer R03, R05, R07, R16, R18, and R24. Classify the behavior and explain the relevant rules.\n\nAnswer C21, C22, C24, and C28. Give a counterexample for each that shows why intuition alone is insufficient.\n\n## 25–50 minutes: Coding problem 1 (20 points)\n\nImplement [P01](../../coding/01-field64/README.md). Explain how you handle a width of 64, an invalid offset, and a value that does not fit. Work through two examples before coding. List boundary tests even if you run out of time to execute them.\n\n## 50–80 minutes: Coding problem 2 (25 points)\n\nImplement [P04](../../coding/04-overlap-move/README.md). Do not use `memcpy`, `memmove`, or `malloc`.\n\nDraw the result for a six-byte buffer with `src = 0`, `dst = 2`, and `count = 4`, then reverse the direction. Explain how you handle zero length and avoid overflow when given large `size_t` values.\n\n## 80–100 minutes: Debugging and systems (15 points)\n\nFind every violation of the P09 contract in D06.\n\n- If two bytes were sent before a busy response, where does the next call start?\n- Should repeated `-1` results keep the function running forever?\n- Can a DMA buffer be reclaimed immediately after a timeout?\n\nUse C41, C43, and C47 to explain the roles of PCIe, NVMe, and DMA in one I/O operation.\n\n## 100–110 minutes: Follow-ups (5 points)\n\nSuppose P01 updates a real MMIO register. What extra assumptions are required? What if some bits are write-one-to-clear? How would you verify the behavior without the device specification?\n\nSuppose P04 takes pointers into two unrelated arrays. Why is pointer ordering not a general way to choose the copy direction?\n\n## 110–120 minutes: Questions and review (5 points)\n\nChoose three questions you would want to ask the team:\n\n- Does the team work on host/NVMe, FTL, or NAND firmware?\n- What features and debugging tasks do new engineers usually take on?\n- How are unit, simulation, and hardware regression tests organized?\n- How are performance problems measured and investigated?\n\nFill in [PROGRESS.md](../../PROGRESS.md), then use the [scoring guide](../../answers/mock-scoring.md).",
    "reference": "# 模擬評分：用來定位弱點\n\n每回100分；不是公司透過線，也不預測錄取。閱卷時記錄是否靠提示，只有能自己解釋才算掌握。\n\n## 共用原則\n\n- Coding：契約與邊界30%、演算法正確40%、清楚可驗證20%、複雜度／限制10%。寫完沒有反例測試不給測試分。\n- 口試／閱讀：分類正確一半，能說原因與反例另一半。UB回答固定輸出，那題分類部分0分。\n- 專案：可說清楚個人貢獻、具體問題、驗證證據、限制各佔1/4。沒有數字也可用重現與測試，但不能虛構量測。\n- 系統設計：ownership與生命週期、正確狀態轉換、錯誤／race處理、平臺假設各佔1/4。不要求某個固定API名稱。\n\n## A 的重點\n\n- 閱讀：R03=260/4；R05=10/20；R07=20/1；R16=false；R18 UB；R24=aabcdf。不能只背輸出，必須講promotion、sequencing或搬移理由。\n- P01：width64特判、驗offset與value、欄位外保持，見implementation-notes。\n- P04：驗bounds不先overflow、方向正確、零長度與size_t反向迴圈。\n- D06／P09：負值先分類、保持累積進度、remaining檢查、budget；timeout不代表device停止。\n- MMIO：register語意、W1C、自清bits、並行ISR、正確accessor／barrier都可能改變普通RMW假設；先查spec再決策。\n\n## B 的重點\n\n- R08=12/8/4；R10=6/12；R12=4；R20 UB；R26實作定義；R31不能保證對齊與合法alias。\n- P05：按header逐byte解碼，完全驗證後提交；回傳borrowed view，不是deep copy。stream需要儲存部分header／payload與framing狀態。\n- P10：NLB+1先升寬、namespace subtraction bounds、位移／exclusive end檢查。\n- CQ／DMA：phase不是CID生命週期，coherency不是ordering；timeout回收需要quiesce保證。\n- FTL：資料與mapping持久化順序／cache政策要明定；GC/wear/ECC/deallocate不可混成同一件事。\n- A14：125MiB/s，穩態32,000IOPS，p99不能當平均；A15不能僅憑tail變差就斷言GC。\n\n## 如何安排補救\n\n自己評70分以上也先看分佈：若C／memory有明顯錯誤，先修P0。總分低先挑兩個根因反覆練，不要一天把所有解答掃過。隔一天不看答案重做，並新增一個能抓原錯誤的測試。\n",
    "mode": "self"
  },
  {
    "id": "M-B",
    "group": "mocks",
    "title": "Mock B: Storage systems and boundary cases",
    "body": "Time: 120 minutes. Use the supplied declarations and problem statements, but not the answers. If you have only an hour, stop at minute 60 and schedule the rest separately. State system assumptions; memorizing the complete NVMe specification is not required.\n\n## 0–10 minutes: Project architecture (10 points)\n\nDraw your project's inputs, parser and state, and outputs. Identify borrowed buffers, owners, error paths, and your contribution. Explain what changes if callbacks run later. Distinguish simulated behavior from features verified on real SSD hardware.\n\n## 10–25 minutes: Code reading (15 points)\n\nAnswer R08, R10, R12, R20, R26, and R31. Discuss `sizeof` evaluation, pointers to arrays, shift bounds, implementation-defined behavior, alignment, and aliasing where applicable. If an answer depends on the implementation, name the specific dependency.\n\n## 25–60 minutes: Coding problem 1 (25 points)\n\nImplement [P05](../../coding/05-packet-view/README.md).\n\nTest a seven-byte input, an unaligned source, reserved flag bits, mismatched lengths, an empty payload, and changes to the original buffer after decoding.\n\nFollow-up: What would the API need to handle a packet received in several chunks?\n\n## 60–85 minutes: Coding problem 2 (20 points)\n\nImplement [P10](../../coding/10-lba-range/README.md). Work through encoded NLB values 0 and `0xFFFF`, the final namespace block, and byte-address overflow. Explain the exercise's exclusive-end requirement.\n\n## 85–105 minutes: Storage and debugging (20 points)\n\nSpend about two minutes each on C44, C48, C51, C52, C55, and C57.\n\nFor D09, define when a buffer can be reclaimed if the device may still be performing DMA after a timeout.\n\nFor A08, can software identify a late completion after CID reuse if the hardware does not return a generation?\n\n## 105–115 minutes: Extension (5 points)\n\nChoose A14 or A15 and state your assumptions and verification plan.\n\nAlternatively, work through P12 with depth 4, head 3, expected phase 1, slot 3 phase 1, slot 0 phase 0, and slot 1 phase 1. Why limit each call to at most `depth` entries?\n\n## 115–120 minutes: Review and questions (5 points)\n\nDescribe one answer you got wrong and a test you would add. Ask about the team's responsibilities, test environment, and measurement tools.\n\nUse the [scoring guide](../../answers/mock-scoring.md) and focus the next session on your two weakest areas.",
    "reference": "# 模擬評分：用來定位弱點\n\n每回100分；不是公司透過線，也不預測錄取。閱卷時記錄是否靠提示，只有能自己解釋才算掌握。\n\n## 共用原則\n\n- Coding：契約與邊界30%、演算法正確40%、清楚可驗證20%、複雜度／限制10%。寫完沒有反例測試不給測試分。\n- 口試／閱讀：分類正確一半，能說原因與反例另一半。UB回答固定輸出，那題分類部分0分。\n- 專案：可說清楚個人貢獻、具體問題、驗證證據、限制各佔1/4。沒有數字也可用重現與測試，但不能虛構量測。\n- 系統設計：ownership與生命週期、正確狀態轉換、錯誤／race處理、平臺假設各佔1/4。不要求某個固定API名稱。\n\n## A 的重點\n\n- 閱讀：R03=260/4；R05=10/20；R07=20/1；R16=false；R18 UB；R24=aabcdf。不能只背輸出，必須講promotion、sequencing或搬移理由。\n- P01：width64特判、驗offset與value、欄位外保持，見implementation-notes。\n- P04：驗bounds不先overflow、方向正確、零長度與size_t反向迴圈。\n- D06／P09：負值先分類、保持累積進度、remaining檢查、budget；timeout不代表device停止。\n- MMIO：register語意、W1C、自清bits、並行ISR、正確accessor／barrier都可能改變普通RMW假設；先查spec再決策。\n\n## B 的重點\n\n- R08=12/8/4；R10=6/12；R12=4；R20 UB；R26實作定義；R31不能保證對齊與合法alias。\n- P05：按header逐byte解碼，完全驗證後提交；回傳borrowed view，不是deep copy。stream需要儲存部分header／payload與framing狀態。\n- P10：NLB+1先升寬、namespace subtraction bounds、位移／exclusive end檢查。\n- CQ／DMA：phase不是CID生命週期，coherency不是ordering；timeout回收需要quiesce保證。\n- FTL：資料與mapping持久化順序／cache政策要明定；GC/wear/ECC/deallocate不可混成同一件事。\n- A14：125MiB/s，穩態32,000IOPS，p99不能當平均；A15不能僅憑tail變差就斷言GC。\n\n## 如何安排補救\n\n自己評70分以上也先看分佈：若C／memory有明顯錯誤，先修P0。總分低先挑兩個根因反覆練，不要一天把所有解答掃過。隔一天不看答案重做，並新增一個能抓原錯誤的測試。\n",
    "mode": "self"
  },
  {
    "id": "CV001",
    "group": "resume",
    "title": "把你真正負責的部分畫出來",
    "topic": "01 履歷主張與證據",
    "scope": "resume",
    "basis": "三個 Selected Projects、ITRI 實習及 Technical Skills",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：三個 Selected Projects、ITRI 實習及 Technical Skills\n\n範圍：履歷必答／實作深挖\n\n選一個履歷專案，畫出從輸入到輸出的完整資料路徑。每一段都標明是你寫的、套件提供的，還是框架原有的。\n\n主管追問：\n1. 指出三個核心函式及其呼叫者，不能只說模組名稱。\n2. 每條跨模組邊界由誰擁有 buffer？何時交接？\n3. 拿掉你寫的部分，系統具體少了什麼能力？\n4. 我隨機選一條失敗路徑，你能一路追到資源回收嗎？",
    "reference": "### 判分要點\n- 必須區分自己的修改與既有框架\n- 資料流要包含控制流、錯誤回傳與生命週期\n- 圖與實際程式路徑一致\n\n### 必須拿出的證據\n提供真實檔案路徑、commit 或 diff，以及能重現核心功能的命令。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "三個 Selected Projects、ITRI 實習及 Technical Skills"
    },
    "sources": []
  },
  {
    "id": "CV002",
    "group": "resume",
    "title": "Reliable 不是專案名稱就算數",
    "topic": "01 履歷主張與證據",
    "scope": "resume",
    "basis": "三個 Selected Projects、ITRI 實習及 Technical Skills",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：三個 Selected Projects、ITRI 實習及 Technical Skills\n\n範圍：履歷必答／實作深挖\n\n你的專案叫 Reliable Linux Data Acquisition Service。先定義可靠性的可驗證條件，我不接受「沒有當機」當全部答案。\n\n主管追問：\n1. 資料遺失、重複、亂序、延遲各自的容許條件是什麼？\n2. 上游持續送、下游永久停住時，哪個保證必須讓步？\n3. 程序 crash 與正常 SIGTERM 的保證是否不同？\n4. 你如何證明未觀察到錯誤，而不是錯誤沒有被記錄？",
    "reference": "### 判分要點\n- 要先列故障模型與保證邊界\n- 有限記憶體、永不丟失、無限慢消費不能無條件同時成立\n- 可靠性必須有計數與可重現測試\n\n### 必須拿出的證據\n提供輸入序號與輸出序號的核對方式、失敗統計及明確限制。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "三個 Selected Projects、ITRI 實習及 Technical Skills"
    },
    "sources": []
  },
  {
    "id": "CV003",
    "group": "resume",
    "title": "空機重現你的整個專案",
    "topic": "01 履歷主張與證據",
    "scope": "resume",
    "basis": "三個 Selected Projects、ITRI 實習及 Technical Skills",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：三個 Selected Projects、ITRI 實習及 Technical Skills\n\n範圍：履歷必答／實作深挖\n\n我給你一台乾淨 Linux 主機，沒有你的 shell history。你如何讓另一位工程師重現建置、開機與測試？\n\n主管追問：\n1. 哪些版本必須固定，哪些只是記在 README 不夠？\n2. host toolchain、target sysroot 與下載依賴怎麼區分？\n3. 測試成功依賴時間、網路或人工操作時怎麼處理？\n4. 只拿到 binary，如何追回對應的 source 與設定？",
    "reference": "### 判分要點\n- 區分可重現流程與 bit-for-bit reproducible build\n- 固定來源、設定、工具鏈與測試種子\n- 產物要能追溯版本\n\n### 必須拿出的證據\n給出乾淨建置命令、依賴版本、defconfig、測試入口與產物識別。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "三個 Selected Projects、ITRI 實習及 Technical Skills"
    },
    "sources": []
  },
  {
    "id": "CV004",
    "group": "resume",
    "title": "最難的 bug，請從錯誤假設開始",
    "topic": "01 履歷主張與證據",
    "scope": "resume",
    "basis": "三個 Selected Projects、ITRI 實習及 Technical Skills",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：三個 Selected Projects、ITRI 實習及 Technical Skills\n\n範圍：履歷必答／實作深挖\n\n選你真的修過的最難 bug。從第一個錯誤假設開始講，禁止只講最後的解法。\n\n主管追問：\n1. 第一份 log 能排除什麼，又不能排除什麼？\n2. 最小重現條件如何縮小？有沒有改變 bug 本身？\n3. 你用什麼實驗區分兩個競爭假說？\n4. 修正為什麼有效？哪個 regression test 會讓舊版必定失敗？",
    "reference": "### 判分要點\n- 事件、假說、實驗、根因與修正分開\n- 相關性不能代替因果\n- 必須說明原本不變數在哪裡被破壞\n\n### 必須拿出的證據\n提供去識別化 trace、失敗輸入及修正前後同一測試的結果。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "三個 Selected Projects、ITRI 實習及 Technical Skills"
    },
    "sources": []
  },
  {
    "id": "CV005",
    "group": "resume",
    "title": "你為什麼沒有選更簡單的設計",
    "topic": "01 履歷主張與證據",
    "scope": "resume",
    "basis": "三個 Selected Projects、ITRI 實習及 Technical Skills",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：三個 Selected Projects、ITRI 實習及 Technical Skills\n\n範圍：履歷必答／實作深挖\n\n對一個你自行做的架構決定，提出兩個更簡單的替代方案，然後說服我你的複雜度值得。\n\n主管追問：\n1. 每個方案在故障時的行為差在哪裡？\n2. 你付出的額外記憶體、鎖與維護成本是多少？\n3. 哪個需求改變會使你原來的決定變錯？\n4. 今天只有兩天交付，你會刪掉哪些功能而不破壞契約？",
    "reference": "### 判分要點\n- 比較必須使用同一組需求\n- 成本包含錯誤路徑與維護\n- 承認適用範圍與撤回條件\n\n### 必須拿出的證據\n給出實際決策點、被拒絕方案與需求或量測依據。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "三個 Selected Projects、ITRI 實習及 Technical Skills"
    },
    "sources": []
  },
  {
    "id": "CV006",
    "group": "resume",
    "title": "bounded 到底 bounded 在哪裡",
    "topic": "01 履歷主張與證據",
    "scope": "resume",
    "basis": "三個 Selected Projects、ITRI 實習及 Technical Skills",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：三個 Selected Projects、ITRI 實習及 Technical Skills\n\n範圍：履歷必答／實作深挖\n\n履歷說 bounded queues。請證明整個服務的記憶體有上界，而不只是某一個 ring buffer 有固定大小。\n\n主管追問：\n1. 每個連線、未完成 frame、log、重試與核心 socket buffer 算了嗎？\n2. 連線數是否也有上界？誰強制執行？\n3. 單個 frame 的長度欄位能不能繞過記憶體上限？\n4. 超過預算時，系統的精確拒絕或丟棄策略是什麼？",
    "reference": "### 判分要點\n- 建立所有儲存層的預算而非只列一個陣列\n- 外部資源與每連線成本也要限制\n- 上限違反必須有明確行為\n\n### 必須拿出的證據\n提供記憶體上界公式、設定值與最壞負載下的 RSS/queue 指標。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "三個 Selected Projects、ITRI 實習及 Technical Skills"
    },
    "sources": []
  },
  {
    "id": "CV007",
    "group": "resume",
    "title": "效能數字的分母在哪裡",
    "topic": "01 履歷主張與證據",
    "scope": "resume",
    "basis": "三個 Selected Projects、ITRI 實習及 Technical Skills",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：三個 Selected Projects、ITRI 實習及 Technical Skills\n\n範圍：履歷必答／實作深挖\n\n假設你要在面試說效能變好，請先定義一個公平的實驗，不要先給我漂亮的百分比。\n\n主管追問：\n1. baseline、工作負載與 warm-up 如何固定？\n2. 吞吐量上升但 p99 變差算不算改善？\n3. CPU、頻率、cache、虛擬機排程如何干擾結果？\n4. 樣本數、變異與測量開銷怎麼報告？",
    "reference": "### 判分要點\n- 先定義指標、單位、負載與比較對象\n- 平均值不足以支持尾延遲主張\n- 沒有實測就不能聲稱改善比例\n\n### 必須拿出的證據\n提供原始測量、腳本與環境；沒有數據時明確提出待驗證假說。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "三個 Selected Projects、ITRI 實習及 Technical Skills"
    },
    "sources": []
  },
  {
    "id": "CV008",
    "group": "resume",
    "title": "你的測試為什麼值得相信",
    "topic": "01 履歷主張與證據",
    "scope": "resume",
    "basis": "三個 Selected Projects、ITRI 實習及 Technical Skills",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：三個 Selected Projects、ITRI 實習及 Technical Skills\n\n範圍：履歷必答／實作深挖\n\n履歷列了自動化測試。假設測試程式和實作一起寫錯，你怎麼發現？\n\n主管追問：\n1. oracle 是否只是把實作換個名字再寫一次？\n2. 如何加入截斷、重複、亂序、慢速與錯誤注入？\n3. 隨機測試失敗後如何用 seed 與縮減重現？\n4. 請設計一個看起來合理但錯的實作，證明測試會抓到。",
    "reference": "### 判分要點\n- 區分範例、邊界、性質與系統測試\n- oracle 應盡量獨立\n- mutation 與故障注入要命中真實契約\n\n### 必須拿出的證據\n展示測試清單、一個已抓到的 bug，以及能拒絕錯誤實作的案例。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "三個 Selected Projects、ITRI 實習及 Technical Skills"
    },
    "sources": []
  },
  {
    "id": "CV009",
    "group": "resume",
    "title": "你做的與課程框架做的",
    "topic": "01 履歷主張與證據",
    "scope": "resume",
    "basis": "三個 Selected Projects、ITRI 實習及 Technical Skills",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：三個 Selected Projects、ITRI 實習及 Technical Skills\n\n範圍：履歷必答／實作深挖\n\n履歷提到在 supplied framework 實作 Verilog scoreboard。把你的貢獻與框架功能切清楚。\n\n主管追問：\n1. issue、operand read、execute、writeback 哪些由你決定？\n2. 哪個 hazard 是你的邏輯阻擋，哪個由框架保證不發生？\n3. 你修改了哪些介面，如何避免破壞其他模組？\n4. 如果把課程測試全部拿掉，你自己會補哪三個反例？",
    "reference": "### 判分要點\n- 不能把整個 CPU 或驗證平台當作個人完成品\n- 必須交代自己控制的狀態與假設\n- 以時序而非名詞說明貢獻\n\n### 必須拿出的證據\n提供自己的 RTL diff、介面與一份逐 cycle trace。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "三個 Selected Projects、ITRI 實習及 Technical Skills"
    },
    "sources": []
  },
  {
    "id": "CV010",
    "group": "resume",
    "title": "技能表每個字都要負責",
    "topic": "01 履歷主張與證據",
    "scope": "resume",
    "basis": "三個 Selected Projects、ITRI 實習及 Technical Skills",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：三個 Selected Projects、ITRI 實習及 Technical Skills\n\n範圍：履歷必答／實作深挖\n\n你列了 C、C++、Python、Verilog。各選一段你親自寫的程式，說明使用範圍與能力邊界。\n\n主管追問：\n1. C++ 是實際專案使用，還是課程熟悉？不要混在一起。\n2. Python 在測試裡如何保證不把短讀誤判成完整輸入？\n3. Verilog 哪些程式能綜合，哪些只是 testbench？\n4. 哪一項你目前最弱？如何用可驗證的工作補足？",
    "reference": "### 判分要點\n- 技能深度要與實際作品一致\n- 清楚區分應用、課程與熟悉程度\n- 不能用工具名稱代替設計能力\n\n### 必須拿出的證據\n每項提供一個可檢查的實作或測試，缺少實務使用時直接說明。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "三個 Selected Projects、ITRI 實習及 Technical Skills"
    },
    "sources": []
  },
  {
    "id": "CV011",
    "group": "resume",
    "title": "電子電機碩士如何轉成韌體能力",
    "topic": "01 履歷主張與證據",
    "scope": "resume",
    "basis": "三個 Selected Projects、ITRI 實習及 Technical Skills",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：三個 Selected Projects、ITRI 實習及 Technical Skills\n\n範圍：履歷必答／實作深挖\n\n履歷列了碩士學歷，但沒有交代論文內容。請用兩分鐘講清楚研究問題、你的方法與個人貢獻。\n\n主管追問：\n1. 哪些結論是你證明或量測的，哪些來自既有方法？\n2. 研究中最不可靠的假設是什麼？\n3. 研究經驗如何具體幫助分析 firmware 問題？\n4. 如果無法重現當年的最佳結果，你如何處理？",
    "reference": "### 判分要點\n- 先交代履歷未提供的事實，不猜題目\n- 研究問題、方法與證據要連起來\n- 轉用到韌體的能力須有具體例子\n\n### 必須拿出的證據\n提供真實研究摘要、可公開的實驗設計與自己的貢獻邊界。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "三個 Selected Projects、ITRI 實習及 Technical Skills"
    },
    "sources": []
  },
  {
    "id": "CV012",
    "group": "resume",
    "title": "交接時只准留下五個檔案",
    "topic": "01 履歷主張與證據",
    "scope": "resume",
    "basis": "三個 Selected Projects、ITRI 實習及 Technical Skills",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：三個 Selected Projects、ITRI 實習及 Technical Skills\n\n範圍：履歷必答／實作深挖\n\n你明天離開專案，只准留下五份交接材料。選什麼，讓下一位工程師能維護而不依賴你？\n\n主管追問：\n1. 如何保留狀態機、資源生命週期與錯誤契約？\n2. 哪些測試是發版前一定要跑的？\n3. 已知限制如何防止被誤認成支援功能？\n4. 如何從一份使用者問題回報找到第一個可行的重現入口？",
    "reference": "### 判分要點\n- 優先保留可執行建置與測試、介面契約與除錯路徑\n- 文件要能追到版本\n- 已知限制需具體可操作\n\n### 必須拿出的證據\n提出五項真實材料及其位置，說明缺少任一項會造成的維護風險。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "三個 Selected Projects、ITRI 實習及 Technical Skills"
    },
    "sources": []
  },
  {
    "id": "CV013",
    "group": "resume",
    "title": "零複製的指標能活多久",
    "topic": "02 C 與記憶體契約",
    "scope": "resume",
    "basis": "C service、reusable ring buffer、streaming parser、C/C++ 技能",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C service、reusable ring buffer、streaming parser、C/C++ 技能\n\n範圍：履歷必答／實作深挖\n\nparser 回傳指向 ring 的 payload，consumer 稍後才使用。producer 已經讓 ring 繞回。你如何證明資料還有效？\n\n主管追問：\n1. borrowed view 的有效期在哪個介面上寫清楚？\n2. 加 mutex 能不能單獨解決鎖釋放後的生命週期？\n3. copy、pin、refcount 各會付出什麼代價？\n4. 取消與 disconnect 同時發生時，誰最後釋放？",
    "reference": "### 判分要點\n- 同步與生命週期是不同問題\n- 必須定義交接、歸還及重用條件\n- 任何非同步讀取都要延長有效期或擁有副本\n\n### 必須拿出的證據\n畫出一個 wrap/reuse 導致錯讀的時序，以及你專案採用的 ownership 契約。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C service、reusable ring buffer、streaming parser、C/C++ 技能"
    },
    "sources": []
  },
  {
    "id": "CV014",
    "group": "resume",
    "title": "長度檢查先溢位就白做了",
    "topic": "02 C 與記憶體契約",
    "scope": "resume",
    "basis": "C service、reusable ring buffer、streaming parser、C/C++ 技能",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C service、reusable ring buffer、streaming parser、C/C++ 技能\n\n範圍：履歷必答／實作深挖\n\n收到 count、element_size 與 header_length 後要配置 buffer。請寫出不依賴已溢位結果的驗證順序。\n\n主管追問：\n1. size_t 的乘法、加法與對齊 padding 各怎麼驗？\n2. 負的 ssize_t 何時才可以轉成 size_t？\n3. 32-bit host 與 64-bit host 有哪些差異？\n4. 檢查失敗前已配置兩個資源，要怎麼回收？",
    "reference": "### 判分要點\n- 先用除法與減法做前置範圍驗證\n- 有號錯誤值先分類\n- 建立單一可驗證的失敗清理路徑\n\n### 必須拿出的證據\n給出 SIZE_MAX 邊界反例、函式契約與輸出保持不變的測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C service、reusable ring buffer、streaming parser、C/C++ 技能"
    },
    "sources": []
  },
  {
    "id": "CV015",
    "group": "resume",
    "title": "這個 cast 為什麼不是解碼",
    "topic": "02 C 與記憶體契約",
    "scope": "resume",
    "basis": "C service、reusable ring buffer、streaming parser、C/C++ 技能",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C service、reusable ring buffer、streaming parser、C/C++ 技能\n\n範圍：履歷必答／實作深挖\n\n你把 wire buffer 加一後 cast 成 uint32_t* 再解參照。請說明這與逐 byte 解碼的差異。\n\n主管追問：\n1. 哪個步驟涉及 alignment，哪個涉及型別存取規則？\n2. x86 看起來能跑是否構成 C 語言合法性的證明？\n3. memcpy 到真正的 uint32_t 後，還剩哪個 byte-order 問題？\n4. 若欄位是 MMIO 而不是一般 RAM，方法還能照搬嗎？",
    "reference": "### 判分要點\n- 分開討論對齊、有效型別、endianness 與 I/O 存取語意\n- 指標轉型不建立合法物件\n- 不要用一次實測替代語言契約\n\n### 必須拿出的證據\n畫出四個 bytes、解碼公式與至少一個未對齊輸入的測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C service、reusable ring buffer、streaming parser、C/C++ 技能"
    },
    "sources": []
  },
  {
    "id": "CV016",
    "group": "resume",
    "title": "一行位移藏了三種錯",
    "topic": "02 C 與記憶體契約",
    "scope": "resume",
    "basis": "C service、reusable ring buffer、streaming parser、C/C++ 技能",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C service、reusable ring buffer、streaming parser、C/C++ 技能\n\n範圍：履歷必答／實作深挖\n\n設計一個可更新 64-bit register 欄位的函式，width 可以是 64。我會故意給你 signed value 與非法 offset。\n\n主管追問：\n1. 1、1U、UINT64_C(1) 的左移型別差在哪？\n2. width=64 如何避免 shift by 64？\n3. value 放不下是拒絕還是截斷？你如何保持欄位外的 bits？\n4. 這個 read-modify-write 若用在 W1C register，為什麼可能錯？",
    "reference": "### 判分要點\n- 先驗輸入範圍並處理全寬\n- 使用足夠寬的無號運算\n- 普通整數操作不能自動套用特殊暫存器語意\n\n### 必須拿出的證據\n寫出函式前後條件及 width/offset/value 的邊界測試矩陣。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C service、reusable ring buffer、streaming parser、C/C++ 技能"
    },
    "sources": []
  },
  {
    "id": "CV017",
    "group": "resume",
    "title": "struct 不能直接當 wire format",
    "topic": "02 C 與記憶體契約",
    "scope": "resume",
    "basis": "C service、reusable ring buffer、streaming parser、C/C++ 技能",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C service、reusable ring buffer、streaming parser、C/C++ 技能\n\n範圍：履歷必答／實作深挖\n\n你想把 struct 直接 send 出去，或當 ioctl 的參數。請指出兩種情境各自的相容性陷阱。\n\n主管追問：\n1. padding 與未初始化 bytes 會不會洩漏資訊？\n2. 指標、long、size_t 在 32/64-bit ABI 如何變？\n3. packed 能不能同時解決 endian 與對齊問題？\n4. 介面演進時如何保留舊使用者的行為？",
    "reference": "### 判分要點\n- wire 格式要明確欄位寬度與byte order\n- UAPI 要注意布局、padding 與 compat\n- packed 不是通用安全轉換\n\n### 必須拿出的證據\n給出固定格式及兩種 ABI 的 layout 檢查方式。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C service、reusable ring buffer、streaming parser、C/C++ 技能"
    },
    "sources": []
  },
  {
    "id": "CV018",
    "group": "resume",
    "title": "memcpy 在 ring 裡哪裡會出事",
    "topic": "02 C 與記憶體契約",
    "scope": "resume",
    "basis": "C service、reusable ring buffer、streaming parser、C/C++ 技能",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C service、reusable ring buffer、streaming parser、C/C++ 技能\n\n範圍：履歷必答／實作深挖\n\n你要把 ring 中尚未處理的資料移到前面。請先判斷來源與目的地是否可能重疊，再選操作。\n\n主管追問：\n1. 怎麼證明複製長度沒有超出任一範圍？\n2. 跨 wrap 時為什麼不能假設來源是一整段連續記憶體？\n3. 如果只能手寫迴圈，方向如何決定？\n4. 來源與目的地不是同一個 array 時，可以任意比較指標大小嗎？",
    "reference": "### 判分要點\n- 重疊用 memmove 語意\n- 分清邏輯連續與實體連續\n- 範圍檢查避免先加法溢位，無關物件指標不能任意排序\n\n### 必須拿出的證據\n提供左右重疊、零長度、wrap 與 guard bytes 測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C service、reusable ring buffer、streaming parser、C/C++ 技能"
    },
    "sources": []
  },
  {
    "id": "CV019",
    "group": "resume",
    "title": "double pointer 到底改了誰",
    "topic": "02 C 與記憶體契約",
    "scope": "resume",
    "basis": "C service、reusable ring buffer、streaming parser、C/C++ 技能",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C service、reusable ring buffer、streaming parser、C/C++ 技能\n\n範圍：履歷必答／實作深挖\n\n一個 create 函式要回傳新物件，也可能失敗。請用 out pointer 設計介面並定義失敗行為。\n\n主管追問：\n1. 只傳 int* 能不能讓 caller 的指標變成新位址？\n2. out==NULL 與 *out==NULL 各代表什麼？\n3. 部分初始化後失敗，哪些資源已取得？\n4. destroy 能否接受 NULL、重複呼叫或 stack 物件？",
    "reference": "### 判分要點\n- 區分修改 pointee 與修改 caller 的 pointer\n- 所有權與配對釋放必須明確\n- 重複 destroy 不是自動合法\n\n### 必須拿出的證據\n畫 caller 指標與物件的關係，逐一列出每個配置失敗點。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C service、reusable ring buffer、streaming parser、C/C++ 技能"
    },
    "sources": []
  },
  {
    "id": "CV020",
    "group": "resume",
    "title": "C++ RAII 不會替你補設計",
    "topic": "02 C 與記憶體契約",
    "scope": "resume",
    "basis": "C service、reusable ring buffer、streaming parser、C/C++ 技能",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C service、reusable ring buffer、streaming parser、C/C++ 技能\n\n範圍：履歷必答／實作深挖\n\n你列了 C++。把 C service 的 fd、thread 與 buffer 改成 RAII wrapper，哪些問題會解決，哪些不會？\n\n主管追問：\n1. copy/move 後到底誰擁有 fd？\n2. 析構與 worker 還在使用資源時如何協調？\n3. 例外或早退能否安全執行完整清理？\n4. 你的 C++ 標準版本與實際使用經驗到哪裡？",
    "reference": "### 判分要點\n- RAII 將資源回收綁定物件生命週期\n- 必須定義唯一或共享所有權、move 與不可丟例外的清理\n- 不能靠析構自動解決競態\n\n### 必須拿出的證據\n畫出 wrapper 的 copy/move/close 行為；未實作時明確標成設計題。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C service、reusable ring buffer、streaming parser、C/C++ 技能"
    },
    "sources": []
  },
  {
    "id": "CV021",
    "group": "resume",
    "title": "volatile 為什麼救不了 data race",
    "topic": "02 C 與記憶體契約",
    "scope": "resume",
    "basis": "C service、reusable ring buffer、streaming parser、C/C++ 技能",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C service、reusable ring buffer、streaming parser、C/C++ 技能\n\n範圍：履歷必答／實作深挖\n\n兩個 thread 共用 stop flag 和 ring indices。有人建議全部加 volatile。請給我反例。\n\n主管追問：\n1. C 的 data race 與 CPU cache 不一致是同一件事嗎？\n2. 哪些狀態需要 mutex，哪些可用 atomic？\n3. acquire/release 要對應哪一次資料發布？\n4. 為什麼單機測試一百萬次通過仍不足以證明正確？",
    "reference": "### 判分要點\n- volatile 不建立 thread 間同步\n- 先定義 shared state 與 happens-before\n- 語言規則、硬體ordering和測試證據分開\n\n### 必須拿出的證據\n提供可描述的反例時序，以及修正後的同步關係。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C service、reusable ring buffer、streaming parser、C/C++ 技能"
    },
    "sources": []
  },
  {
    "id": "CV022",
    "group": "resume",
    "title": "巨集、錯誤碼與重複副作用",
    "topic": "02 C 與記憶體契約",
    "scope": "resume",
    "basis": "C service、reusable ring buffer、streaming parser、C/C++ 技能",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C service、reusable ring buffer、streaming parser、C/C++ 技能\n\n範圍：履歷必答／實作深挖\n\n在 I/O 程式中使用 MIN(read_next(), remaining) 巨集。它可能造成什麼錯？請重新設計。\n\n主管追問：\n1. 傳入 i++ 的巨集何時重複求值？\n2. 括號能解決優先序，能解決 sequencing 嗎？\n3. 如何避免把 errno、負值與 size_t 混在一起？\n4. inline 函式與 _Generic 各解決哪些問題、留下哪些限制？",
    "reference": "### 判分要點\n- 先展開巨集辨識副作用\n- 求值次數與型別轉換需獨立分析\n- 先保存 I/O 結果再分類狀態\n\n### 必須拿出的證據\n提供一個會多讀資料或跳過資料的反例，並對照修正版測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C service、reusable ring buffer、streaming parser、C/C++ 技能"
    },
    "sources": []
  },
  {
    "id": "CV023",
    "group": "resume",
    "title": "SPSC 的前提是什麼",
    "topic": "02 C 與記憶體契約",
    "scope": "resume",
    "basis": "C service、reusable ring buffer、streaming parser、C/C++ 技能",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C service、reusable ring buffer、streaming parser、C/C++ 技能\n\n範圍：履歷必答／實作深挖\n\n你說 reusable ring buffer。假設改成 lock-free SPSC，請逐一列出它必須依賴的前提。\n\n主管追問：\n1. producer 與 consumer 各自只可寫哪些欄位？\n2. 先更新 head 再寫 payload 會出現什麼觀察？\n3. counter wrap 與滿／空判斷需要哪個距離不變數？\n4. 第二個 producer 加進來，原本哪一段證明立刻失效？",
    "reference": "### 判分要點\n- SPSC 不是任意並行安全\n- payload publication 與 slot reuse 需要對應同步\n- counter距離、容量與wrap契約要清楚\n\n### 必須拿出的證據\n畫出發布與回收時序，說明實際專案是加鎖還是 lock-free，不能混稱。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C service、reusable ring buffer、streaming parser、C/C++ 技能"
    },
    "sources": []
  },
  {
    "id": "CV024",
    "group": "resume",
    "title": "錯誤回傳不能留下半成品",
    "topic": "02 C 與記憶體契約",
    "scope": "resume",
    "basis": "C service、reusable ring buffer、streaming parser、C/C++ 技能",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C service、reusable ring buffer、streaming parser、C/C++ 技能\n\n範圍：履歷必答／實作深挖\n\n一個 parser 或配置 API 規定失敗時 output 不變。你打算邊檢查邊寫 output，哪裡會違約？\n\n主管追問：\n1. 後面才發現非法欄位時，如何回滾先前修改？\n2. 區域暫存與先驗證再提交各適合哪種輸出？\n3. 大型 buffer 無法整份複製時怎麼保證原子提交？\n4. 呼叫 callback 已造成外部副作用後，還能承諾全部回滾嗎？",
    "reference": "### 判分要點\n- 區分記憶體輸出的提交與不可逆外部副作用\n- 先驗證、容量預估或局部暫存\n- 失敗契約必須可實現\n\n### 必須拿出的證據\n列出所有 return 路徑，使用 sentinel 驗證失敗時每個可觀察欄位不變。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C service、reusable ring buffer、streaming parser、C/C++ 技能"
    },
    "sources": []
  },
  {
    "id": "CV025",
    "group": "resume",
    "title": "八 MiB 的 queue 可以撐多久",
    "topic": "03 Ring 與背壓上界",
    "scope": "resume",
    "basis": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer\n\n範圍：履歷必答／實作深挖\n\n輸入固定 120 MB/s，consumer 只有 80 MB/s，queue 容量為 8 MiB。假設 MB=10^6 bytes，MiB=2^20 bytes。多久會滿？\n\n主管追問：\n1. 算式裡用的是輸入速率還是速率差？\n2. 初始已有一半資料時還有多久？\n3. 若以 250 ms 為控制週期才檢查一次，策略是否來得及？\n4. consumer 永久比較慢，增加容量到底解決了什麼？",
    "reference": "### 判分要點\n- 空 queue 的填滿時間是 8×2^20/(40×10^6)，約0.2097152秒\n- 一半空間約0.1048576秒\n- 容量只吸收有限突發，不能消除長期速率赤字\n\n### 必須拿出的證據\n寫出單位、初始條件、觸發閾值與最壞處理延遲。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV026",
    "group": "resume",
    "title": "head 等於 tail 是空還是滿",
    "topic": "03 Ring 與背壓上界",
    "scope": "resume",
    "basis": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer\n\n範圍：履歷必答／實作深挖\n\n你用兩個 index 表示 ring 狀態。現在 head==tail，我不讓你加一句「通常是空的」就結束。\n\n主管追問：\n1. 保留一格、額外 used、單調 counter 三種方案各怎麼定義？\n2. 容量不是二的冪時，bit mask 還能不能用？\n3. counter 繞回後，距離比較靠哪個不變數？\n4. 如何用容量 1、2、3 把錯誤最快測出來？",
    "reference": "### 判分要點\n- 必須選定一種完整表示法\n- 使用 mask 需要容量條件\n- 索引與佔用距離要有明確邊界，不能混用不同方案的判斷式\n\n### 必須拿出的證據\n提供狀態定義、空滿公式與遍歷小容量狀態的測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV027",
    "group": "resume",
    "title": "上游不能停，背壓往哪裡送",
    "topic": "03 Ring 與背壓上界",
    "scope": "resume",
    "basis": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer\n\n範圍：履歷必答／實作深挖\n\n假設資料來自不能暫停的實體來源，而 socket consumer 可任意變慢。你的 backpressure 還有什麼實際作用？\n\n主管追問：\n1. 哪一層可以暫停，哪一層只能丟資料？\n2. 丟新資料、丟舊資料或斷線各如何影響 frame 完整性？\n3. 如何把遺失事件通知 consumer，而不是默默跳資料？\n4. 若需求是絕不丟失，你需要改變哪個系統前提？",
    "reference": "### 判分要點\n- 背壓必須能傳到可控的產生端才可限制來源\n- 不可控輸入需要明確過載政策\n- 有限資源無法提供無條件永久不丟失\n\n### 必須拿出的證據\n畫出控制信號能傳到的最遠位置，附完整 frame 層級的丟棄測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV028",
    "group": "resume",
    "title": "水位線為什麼會抖動",
    "topic": "03 Ring 與背壓上界",
    "scope": "resume",
    "basis": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer\n\n範圍：履歷必答／實作深挖\n\nqueue 一滿就停讀，一有空位就恢復。系統現在不停切換狀態，延遲反而上升。請設計控制策略。\n\n主管追問：\n1. 高低水位線如何選，是否需要 hysteresis？\n2. 一次 read 可能超過剩餘空間時如何限額？\n3. 從停讀到實際停止進資料之間還有多少 in-flight bytes？\n4. 什麼指標可以區分控制抖動與真正的吞吐瓶頸？",
    "reference": "### 判分要點\n- 以高低閾值避免反覆切換\n- 容量預留必須涵蓋已在途資料與處理延遲\n- 每次I/O受剩餘預算約束\n\n### 必須拿出的證據\n提供水位狀態機、最壞在途量與水位隨時間的量測。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV029",
    "group": "resume",
    "title": "一個慢 client 要拖死全部人嗎",
    "topic": "03 Ring 與背壓上界",
    "scope": "resume",
    "basis": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer\n\n範圍：履歷必答／實作深挖\n\n服務改成一對多：一個來源供十個 consumer，其中一個停止讀。你如何保護其他九個？\n\n主管追問：\n1. 共用 queue 與每 client queue 的所有權及記憶體成本差在哪？\n2. 共用 payload 加 refcount 時，最慢 client 會卡住哪一段回收？\n3. 斷開慢 client 的門檻如何避免誤傷短暫抖動？\n4. 資料一致性需要所有 client 都看到相同序號嗎？",
    "reference": "### 判分要點\n- 先定義隔離與交付語意\n- 共享payload仍可能被最慢引用者固定\n- 每client預算、限速與斷線規則必須可觀察\n\n### 必須拿出的證據\n給出每client資源公式與一慢九快的測試結果或設計。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV030",
    "group": "resume",
    "title": "跨尾端的零複製 API",
    "topic": "03 Ring 與背壓上界",
    "scope": "resume",
    "basis": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer\n\n範圍：履歷必答／實作深挖\n\n一筆 frame 在 ring 尾端分成兩段。你不能移動資料，也不能假裝它連續。請設計 peek/consume 介面。\n\n主管追問：\n1. 回傳一個 pointer 為什麼不夠？\n2. 兩段 span 的長度如何避免超出 used？\n3. consumer 只處理第一段時，consume 能否前進整筆？\n4. peek 後 producer 可以改寫哪些區域？",
    "reference": "### 判分要點\n- 以兩段span或明確複製策略描述wrap\n- consume只提交已處理bytes\n- 必須規定peek有效期與slot重用邊界\n\n### 必須拿出的證據\n列出介面前後條件，對尾端剩1 byte的header與payload做測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV031",
    "group": "resume",
    "title": "固定容量不代表沒有配置尖峰",
    "topic": "03 Ring 與背壓上界",
    "scope": "resume",
    "basis": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer\n\n範圍：履歷必答／實作深挖\n\n你說 queue 已預配置，但每個錯誤事件都會建立一筆動態 log。壞輸入持續湧入時，上界還成立嗎？\n\n主管追問：\n1. 錯誤訊息、統計標籤與重試物件如何限制數量？\n2. 大量不同錯誤碼或client ID會不會讓 map 無限成長？\n3. 限流 log 後如何保留足夠診斷資訊？\n4. 配置失敗是否會再次配置一個錯誤訊息？",
    "reference": "### 判分要點\n- 所有輔助路徑也要有上界\n- 高基數指標和錯誤日誌是常見隱藏來源\n- 錯誤處理不能遞迴增加同類壓力\n\n### 必須拿出的證據\n提供錯誤洪水下的資源與log速率上界。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV032",
    "group": "resume",
    "title": "公平排程還是最大吞吐",
    "topic": "03 Ring 與背壓上界",
    "scope": "resume",
    "basis": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer\n\n範圍：履歷必答／實作深挖\n\n單次 poll 後你會一直處理同一個熱連線直到 EAGAIN。另一個低流量連線開始出現數秒延遲。\n\n主管追問：\n1. 每輪應用 byte budget、frame budget 還是時間 budget？\n2. 用完budget但fd仍ready時，下輪怎麼避免遺忘？\n3. 公平性對cache locality與吞吐有什麼代價？\n4. 如何量測每個client的等待時間，而不是只看總吞吐？",
    "reference": "### 判分要點\n- 單個ready來源不能無限制佔用event loop\n- budget與待服務集合需要一致\n- 比較吞吐與每client尾延遲\n\n### 必須拿出的證據\n用一個持續熱來源及多個稀疏來源，展示可重現的公平性測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV033",
    "group": "resume",
    "title": "queue 裡只剩半個 header",
    "topic": "03 Ring 與背壓上界",
    "scope": "resume",
    "basis": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer\n\n範圍：履歷必答／實作深挖\n\npush 一筆資料時空間不足，你已經寫入部分 length header 才發現問題。這個 queue 還能被正常讀嗎？\n\n主管追問：\n1. push 是 byte-stream 語意還是 message 原子語意？\n2. 長度欄位本身跨wrap時，提交點在哪裡？\n3. 無法回滾的情況如何讓consumer識別未完成記錄？\n4. checksum能不能替代有效的提交與容量協議？",
    "reference": "### 判分要點\n- 先定義byte或record契約\n- message queue應先驗完整容量再公開新used/head\n- checksum不提供並行提交或資源原子性\n\n### 必須拿出的證據\n畫出每一步寫入與公開索引的順序，加入每一步失敗的測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV034",
    "group": "resume",
    "title": "共享 queue 的取消會不會餓死",
    "topic": "03 Ring 與背壓上界",
    "scope": "resume",
    "basis": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer\n\n範圍：履歷必答／實作深挖\n\nworker 正等待 queue 有資料，producer 正等待 queue 有空間。此時收到 shutdown。請讓兩邊都能離開。\n\n主管追問：\n1. 等待條件是否包含stop與error狀態？\n2. stop狀態由誰設定，如何發布給所有等待者？\n3. 只喚醒一種waiter會留下誰？\n4. 先join再wake會形成什麼等待環？",
    "reference": "### 判分要點\n- 等待predicate必須包含終止條件\n- 狀態發布、喚醒與join順序一致\n- 不得等待一個永遠不再改變的滿/空條件\n\n### 必須拿出的證據\n提供滿queue與空queue兩種關閉時序，證明沒有遺失喚醒。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV035",
    "group": "resume",
    "title": "用不變數測 ring，不准背範例",
    "topic": "03 Ring 與背壓上界",
    "scope": "resume",
    "basis": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer\n\n範圍：履歷必答／實作深挖\n\n不用先列一百個手寫輸入，請定義可自動驗證的 ring 性質，再讓操作序列去攻擊它。\n\n主管追問：\n1. FIFO順序、內容守恆與容量各如何量化？\n2. 失敗的push/pop應保持哪些可觀察值不變？\n3. 怎麼用簡單線性queue當獨立oracle？\n4. 如何把一千步失敗序列縮成最小反例？",
    "reference": "### 判分要點\n- 利用獨立queue模型、guard與狀態不變數\n- 同時檢查資料與metadata\n- 保留seed並縮減操作序列\n\n### 必須拿出的證據\n展示能抓到wrap錯誤、full/empty混淆與失敗後寫入的測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV036",
    "group": "resume",
    "title": "queue 深度上升不等於瓶頸已知",
    "topic": "03 Ring 與背壓上界",
    "scope": "resume",
    "basis": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer\n\n範圍：履歷必答／實作深挖\n\n監控顯示 queue depth 持續增加。你只能加五個指標，如何區分來源突發、parser慢與consumer慢？\n\n主管追問：\n1. 應記錄哪個位置的bytes與frames？\n2. 計數單位不一致會製造什麼錯誤結論？\n3. 高水位事件、等待時間與服務時間如何分開？\n4. 指標本身能否造成鎖競爭或高基數記憶體問題？",
    "reference": "### 判分要點\n- 在每個邊界記錄進出率、佔用與等待\n- 區分arrival與service\n- 指標設計也要考量成本和固定上界\n\n### 必須拿出的證據\n提出五個具體指標與三個故障情境的預期觀察。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Reliable Linux Data Acquisition Service：bounded queues、backpressure、reusable ring buffer"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV037",
    "group": "resume",
    "title": "poll 說能寫，為什麼還寫不完",
    "topic": "04 POSIX I/O 與連線",
    "scope": "resume",
    "basis": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects\n\n範圍：履歷必答／實作深挖\n\npoll 回報 POLLOUT 後，write 只接受 37 bytes，而你要送 4096 bytes。請逐行描述下次呼叫的pointer與length。\n\n主管追問：\n1. 回傳正值、EINTR、EAGAIN各是否修改累積進度？\n2. 資料已部分送出後，重試會不會造成重複？\n3. 持續POLLOUT但沒有待送資料，event loop會怎樣？\n4. callback或signal如何讓兩次呼叫之間的條件改變？",
    "reference": "### 判分要點\n- readiness不是完整I/O保證\n- 僅依正回傳值前進offset\n- 只在有待送資料時監看可寫，避免busy loop\n\n### 必須拿出的證據\n提供scripted short-write測試及每次pointer/remaining的紀錄。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV038",
    "group": "resume",
    "title": "POLLIN 和 POLLHUP 一起來",
    "topic": "04 POSIX I/O 與連線",
    "scope": "resume",
    "basis": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects\n\n範圍：履歷必答／實作深挖\n\n同一個fd同時回報 POLLIN|POLLHUP。你現在直接close，為什麼可能丟掉最後一筆資料？\n\n主管追問：\n1. EOF是看到HUP就確定，還是read回傳值來確定？\n2. 對正長度read回傳0，stream與不同fd類型的語意如何確認？\n3. 最後一筆只有半個frame時怎麼回報？\n4. close前還有哪些已排隊輸出或callback需要處理？",
    "reference": "### 判分要點\n- 依fd種類與實際read結果處理\n- HUP可能與尚可讀資料並存\n- transport結束與protocol完整性是不同狀態\n\n### 必須拿出的證據\n模擬最後資料與關閉相鄰到達，驗證完整frame與截斷frame。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV039",
    "group": "resume",
    "title": "不要把 EAGAIN 當斷線",
    "topic": "04 POSIX I/O 與連線",
    "scope": "resume",
    "basis": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects\n\n範圍：履歷必答／實作深挖\n\n非阻塞read回傳-1，你的程式直接進reconnect。請設計完整的錯誤分類。\n\n主管追問：\n1. EAGAIN/EWOULDBLOCK與EINTR各要如何處理？\n2. 哪個回傳條件才構成你的EOF判斷？\n3. errno在成功呼叫後還能用來判斷結果嗎？\n4. log或其他函式改變errno時，你如何保存根因？",
    "reference": "### 判分要點\n- 先看回傳值再讀errno\n- EAGAIN表示此刻無法前進，不是斷線\n- EINTR策略與停止條件配合，保存必要錯誤資訊\n\n### 必須拿出的證據\n提供每種回傳序列的狀態轉移表及重試上限。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV040",
    "group": "resume",
    "title": "非阻塞 connect 的完成條件",
    "topic": "04 POSIX I/O 與連線",
    "scope": "resume",
    "basis": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects\n\n範圍：履歷必答／實作深挖\n\nconnect 回傳 EINPROGRESS，稍後poll顯示可寫。你能直接宣告連線成功嗎？\n\n主管追問：\n1. 為什麼要檢查SO_ERROR？\n2. connect timeout與應用層handshake timeout是否相同？\n3. 失敗後fd與parser狀態如何回收？\n4. 同時收到cancel與連線成功時，哪個狀態有最終決定權？",
    "reference": "### 判分要點\n- nonblocking connect以readiness配合SO_ERROR確認結果\n- 連線、協議就緒與取消是不同狀態\n- 所有終止路徑釋放同一組資源\n\n### 必須拿出的證據\n展示成功、拒絕、timeout與cancel交錯的測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV041",
    "group": "resume",
    "title": "重連之後怎麼知道哪筆真的到了",
    "topic": "04 POSIX I/O 與連線",
    "scope": "resume",
    "basis": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects\n\n範圍：履歷必答／實作深挖\n\n舊連線write已回傳成功，但還沒收到應用層確認就斷線。重連後你要不要重送？\n\n主管追問：\n1. kernel接受bytes是否等於對端應用已處理？\n2. 序號、ack與去重窗口由哪一層定義？\n3. 如果接收端已執行不可逆操作，重送如何安全？\n4. 不持久化的session state在程序重啟後還能保證什麼？",
    "reference": "### 判分要點\n- transport送出不等於應用提交\n- at-most-once、at-least-once與去重要有明確協議\n- 重連不能自動創造exactly-once\n\n### 必須拿出的證據\n畫出ack遺失但操作已完成的反例，說明你實際選擇的交付語意。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV042",
    "group": "resume",
    "title": "fd 號碼一樣不是同一個連線",
    "topic": "04 POSIX I/O 與連線",
    "scope": "resume",
    "basis": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects\n\n範圍：履歷必答／實作深挖\n\n連線A關閉，系統把相同fd數字配給B。一個延遲工作仍拿著A的fd，會發生什麼事？\n\n主管追問：\n1. 只以int fd當connection identity有什麼漏洞？\n2. generation或獨立connection物件如何參與驗證？\n3. 誰有權close，其他thread如何知道它已失效？\n4. 如何刻意讓fd快速重用來做測試？",
    "reference": "### 判分要點\n- fd是可重用handle\n- 身份與生命週期必須分開\n- 使用generation、受控擁有者或同步物件避免操作到新資源\n\n### 必須拿出的證據\n提供close/reopen/late-callback時序及能拒絕舊工作的測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV043",
    "group": "resume",
    "title": "SIGPIPE 為什麼讓程序突然消失",
    "topic": "04 POSIX I/O 與連線",
    "scope": "resume",
    "basis": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects\n\n範圍：履歷必答／實作深挖\n\n對端先關閉，你的write路徑讓整個服務終止。你如何確認是否為SIGPIPE，並選擇處理方式？\n\n主管追問：\n1. 忽略SIGPIPE與每次send使用MSG_NOSIGNAL各影響哪個範圍？\n2. EPIPE後還能原fd無限重試嗎？\n3. 半關閉與完整斷線對待送資料有什麼差異？\n4. 你的測試如何區分正常錯誤回傳與signal終止？",
    "reference": "### 判分要點\n- 區分signal預設動作與I/O錯誤\n- Linux專屬旗標需標明\n- 斷線後依連線狀態清理而非永久重試\n\n### 必須拿出的證據\n提供exit status、signal紀錄與對端提前關閉的測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV044",
    "group": "resume",
    "title": "忙等是從哪一個 revents 開始",
    "topic": "04 POSIX I/O 與連線",
    "scope": "resume",
    "basis": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects\n\n範圍：履歷必答／實作深挖\n\nCPU滿載但流量接近零。你只能觀察poll前後的log，如何找出忙等？\n\n主管追問：\n1. events與revents有沒有被混用？\n2. POLLERR、POLLNVAL、POLLHUP是否被忽略而反覆回報？\n3. timeout=0是否真的是設計要求？\n4. 有待送資料才啟用POLLOUT，如何避免狀態切換遺漏？",
    "reference": "### 判分要點\n- 記錄interest、revents、timeout與每輪實際進度\n- 處理terminal/error狀態\n- readiness迴圈需要避免無工作反覆喚醒\n\n### 必須拿出的證據\n提供每輪有界trace與CPU/iteration計數，重現一個無流量熱迴圈。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV045",
    "group": "resume",
    "title": "socket 的種類不能含糊",
    "topic": "04 POSIX I/O 與連線",
    "scope": "resume",
    "basis": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects\n\n範圍：履歷必答／實作深挖\n\n履歷只寫sockets。請先說你實際使用的domain、type、連線模型與訊息邊界，再回答可靠性。\n\n主管追問：\n1. 如果是SOCK_STREAM，為什麼一次write不對應一次read？\n2. 若改SOCK_DGRAM，截斷、順序與丟包需要改哪些契約？\n3. Unix domain與TCP在部署、權限與故障上差在哪？\n4. 目前parser是否錯把transport chunk當作frame？",
    "reference": "### 判分要點\n- 先交代實際選擇而非假設履歷有TCP\n- stream不保留應用訊息邊界\n- 不同transport須重新定義限制與測試\n\n### 必須拿出的證據\n提供實際socket建立參數與fragment/coalesce測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV046",
    "group": "resume",
    "title": "半關閉之後還能送嗎",
    "topic": "04 POSIX I/O 與連線",
    "scope": "resume",
    "basis": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects\n\n範圍：履歷必答／實作深挖\n\n如果你的transport是TCP，對端shutdown寫入方向後，本地端仍有一筆回覆。你會立即丟棄嗎？\n\n主管追問：\n1. read EOF與write方向狀態如何分開？\n2. 應用協議允不允許half-close後送回覆？\n3. 什麼條件代表真正完成session並釋放fd？\n4. EOF與reset的差異要怎麼呈現在錯誤分類？",
    "reference": "### 判分要點\n- half-close與雙向關閉分開建模\n- 具體行為由應用協議決定\n- 保留方向狀態與剩餘資料契約\n\n### 必須拿出的證據\n畫出接收結束但發送尚未完成的session時序。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV047",
    "group": "resume",
    "title": "socket buffer 大不代表使用者 queue 沒滿",
    "topic": "04 POSIX I/O 與連線",
    "scope": "resume",
    "basis": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects\n\n範圍：履歷必答／實作深挖\n\n你把SO_SNDBUF調大後，測試看起來不再背壓。這是真的修好還是只把問題推遲？\n\n主管追問：\n1. kernel buffer佔用如何納入總記憶體預算？\n2. write成功回傳造成的假性throughput如何識別？\n3. 以對端實際消費速度測量時，結果會怎麼變？\n4. 大量連線同時使用大buffer會帶來什麼系統風險？",
    "reference": "### 判分要點\n- 不同層buffer只是改變暫存位置與可吸收突發\n- 交付與吞吐量測點要固定\n- 資源預算必須涵蓋連線數\n\n### 必須拿出的證據\n提供長時間慢消費者測試，區分本地接受速率與對端完成速率。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV048",
    "group": "resume",
    "title": "中斷風暴下 timeout 還算數嗎",
    "topic": "04 POSIX I/O 與連線",
    "scope": "resume",
    "basis": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects\n\n範圍：履歷必答／實作深挖\n\npoll持續被signal中斷。你每次重試都重新使用完整timeout，最後等待時間遠超過設定。如何修？\n\n主管追問：\n1. 相對timeout與絕對deadline怎麼換算？\n2. CLOCK_REALTIME被校時會造成什麼影響？\n3. pselect/ppoll與signal mask如何避免檢查後才睡的race？\n4. 截止時間到達與I/O同時ready時，契約如何決定優先？",
    "reference": "### 判分要點\n- 使用合適單調時鐘與剩餘deadline\n- 重試不能重置總預算\n- signal遮罩與等待需考慮原子交接及明確終止語意\n\n### 必須拿出的證據\n提供EINTR風暴、時間邊界與取消同時發生的測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "C / POSIX poll / sockets；partial I/O、EOF、EINTR/EAGAIN、reconnects"
    },
    "sources": [
      {
        "title": "Linux man-pages: poll",
        "url": "https://man7.org/linux/man-pages/man2/poll.2.html"
      }
    ]
  },
  {
    "id": "CV049",
    "group": "resume",
    "title": "任意切割都必須得到相同結果",
    "topic": "05 CRC 與串流復原",
    "scope": "resume",
    "basis": "CRC-validated streaming parser：fragmented input、malformed frame recovery",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：CRC-validated streaming parser：fragmented input、malformed frame recovery\n\n範圍：履歷必答／實作深挖\n\n同一段合法byte stream，以任意chunk大小餵給parser，輸出的frame序列應一致。請把這個性質變成測試。\n\n主管追問：\n1. header的每一個切割點都有測到嗎？\n2. 一次chunk含三筆frame時，consumed如何計算？\n3. 空chunk是否改變parser狀態？\n4. 如何測試所有切割，而不只固定每次送一個byte？",
    "reference": "### 判分要點\n- 建立chunk partition invariance\n- consumed只涵蓋本次輸入\n- 比較frame內容、數量與剩餘state而非只看return code\n\n### 必須拿出的證據\n給出所有短輸入partition或多種隨機切割的可重現測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "CRC-validated streaming parser：fragmented input、malformed frame recovery"
    },
    "sources": []
  },
  {
    "id": "CV050",
    "group": "resume",
    "title": "CRC 的名字不等於參數",
    "topic": "05 CRC 與串流復原",
    "scope": "resume",
    "basis": "CRC-validated streaming parser：fragmented input、malformed frame recovery",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：CRC-validated streaming parser：fragmented input、malformed frame recovery\n\n範圍：履歷必答／實作深挖\n\n你說使用CRC。請不看程式列出實際算法的完整參數與覆蓋範圍；不知道就直接說還需查證。\n\n主管追問：\n1. width、polynomial、init、refin/refout、xorout分別是什麼？\n2. header、length與payload哪些bytes被涵蓋？\n3. 傳輸中的CRC欄位用什麼byte order？\n4. check vector由獨立實作驗證，還是同一段程式算兩次？",
    "reference": "### 判分要點\n- CRC名稱可能對應不同參數組\n- 反射與byte order不是同一件事\n- 必須使用獨立已知向量並固定覆蓋範圍\n\n### 必須拿出的證據\n提供算法設定、已知向量來源與跨語言對照結果。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "CRC-validated streaming parser：fragmented input、malformed frame recovery"
    },
    "sources": []
  },
  {
    "id": "CV051",
    "group": "resume",
    "title": "CRC 正確就能相信 length 嗎",
    "topic": "05 CRC 與串流復原",
    "scope": "resume",
    "basis": "CRC-validated streaming parser：fragmented input、malformed frame recovery",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：CRC-validated streaming parser：fragmented input、malformed frame recovery\n\n範圍：履歷必答／實作深挖\n\n攻擊者送出超大length，CRC也可以是正確的。你的parser是否先配置巨大記憶體才驗證？\n\n主管追問：\n1. 長度最大值在哪一層限制？\n2. header_length+payload_length在哪個型別計算？\n3. 錯誤length需要吃掉多少輸入才能恢復？\n4. 如果來源永遠不把frame送完，如何限制狀態與等待時間？",
    "reference": "### 判分要點\n- 資源與算術驗證必須在配置及深入存取前完成\n- CRC不是授權或可信來源保證\n- 不完整frame需要大小與時間政策\n\n### 必須拿出的證據\n展示最大長度、溢位、超時與合法CRC惡意長度的測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "CRC-validated streaming parser：fragmented input、malformed frame recovery"
    },
    "sources": []
  },
  {
    "id": "CV052",
    "group": "resume",
    "title": "magic 出現在 payload 裡",
    "topic": "05 CRC 與串流復原",
    "scope": "resume",
    "basis": "CRC-validated streaming parser：fragmented input、malformed frame recovery",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：CRC-validated streaming parser：fragmented input、malformed frame recovery\n\n範圍：履歷必答／實作深挖\n\n你在壞frame之後掃描magic重新同步，但合法payload本身也可能包含magic。為什麼不會誤切？\n\n主管追問：\n1. 候選header需要通過哪些額外限制？\n2. 選錯候選後如何繼續掃描而不跳過下一個真header？\n3. 掃描跨chunk與跨ring尾端時要保留多少prefix？\n4. 長期垃圾輸入能否讓復原永遠不前進？",
    "reference": "### 判分要點\n- resync是協議設計而非單純找字元\n- 候選需長度、版本與完整性驗證\n- 定義每次前進與保留prefix規則\n\n### 必須拿出的證據\n提供payload內嵌magic、重疊magic與候選header截斷的反例。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "CRC-validated streaming parser：fragmented input、malformed frame recovery"
    },
    "sources": []
  },
  {
    "id": "CV053",
    "group": "resume",
    "title": "壞輸入把 O(n) 變成 O(n²)",
    "topic": "05 CRC 與串流復原",
    "scope": "resume",
    "basis": "CRC-validated streaming parser：fragmented input、malformed frame recovery",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：CRC-validated streaming parser：fragmented input、malformed frame recovery\n\n範圍：履歷必答／實作深挖\n\n每次CRC失敗你都從候選起點加一重新掃整段buffer。請構造讓CPU暴增的輸入，然後改善。\n\n主管追問：\n1. 相同bytes會被重算或搬移多少次？\n2. candidate很多但frame永遠差最後一byte時會怎樣？\n3. 如何限制單次feed的工作budget？\n4. 最佳化是否會改變原本可接受的frame序列？",
    "reference": "### 判分要點\n- 分析最壞而非平均複雜度\n- 避免重複掃描、重複搬移與無界CRC工作\n- budget耗盡必須保留可恢復狀態\n\n### 必須拿出的證據\n提供能量測操作次數的對抗性輸入與複雜度界線。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "CRC-validated streaming parser：fragmented input、malformed frame recovery"
    },
    "sources": []
  },
  {
    "id": "CV054",
    "group": "resume",
    "title": "斷線卡在 checksum 前一 byte",
    "topic": "05 CRC 與串流復原",
    "scope": "resume",
    "basis": "CRC-validated streaming parser：fragmented input、malformed frame recovery",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：CRC-validated streaming parser：fragmented input、malformed frame recovery\n\n範圍：履歷必答／實作深挖\n\n連線結束時parser已有完整header與payload，唯獨沒有checksum。你要交付、丟棄還是等待重連補齊？\n\n主管追問：\n1. 跨連線保留半筆frame是否符合session契約？\n2. 如何區分正常結束、截斷、checksum錯誤與transport錯誤？\n3. 上游已計入received的bytes，遺失統計要如何平衡？\n4. 下次連線第一筆frame會不會接到舊payload後面？",
    "reference": "### 判分要點\n- 不得未驗完整性就交付\n- EOF與protocol截斷分開回報\n- session重置策略必須明確並維持計數守恆\n\n### 必須拿出的證據\n以每個byte位置斷線，驗證沒有半筆交付或跨session拼接。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "CRC-validated streaming parser：fragmented input、malformed frame recovery"
    },
    "sources": []
  },
  {
    "id": "CV055",
    "group": "resume",
    "title": "CRC 能不能防止有人改資料",
    "topic": "05 CRC 與串流復原",
    "scope": "resume",
    "basis": "CRC-validated streaming parser：fragmented input、malformed frame recovery",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：CRC-validated streaming parser：fragmented input、malformed frame recovery\n\n範圍：履歷必答／實作深挖\n\n主管要求防止惡意竄改，你回答「我們有CRC」。這個回答哪裡不成立？\n\n主管追問：\n1. 隨機傳輸錯誤與知道算法的攻擊者有何差異？\n2. 攻擊者改payload後能不能重新計算CRC？\n3. 若改用MAC，key管理、重放與序號還缺什麼？\n4. 目前履歷專案實際提供的是哪種完整性保證？",
    "reference": "### 判分要點\n- CRC主要處理偶然錯誤偵測，不等於具密鑰的驗證\n- 安全目標需另外定義\n- 不能把未實作安全機制寫成現有能力\n\n### 必須拿出的證據\n提出可重現的payload+CRC同時修改案例與清楚的保證邊界。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "CRC-validated streaming parser：fragmented input、malformed frame recovery"
    },
    "sources": []
  },
  {
    "id": "CV056",
    "group": "resume",
    "title": "二進位 payload 裡有零",
    "topic": "05 CRC 與串流復原",
    "scope": "resume",
    "basis": "CRC-validated streaming parser：fragmented input、malformed frame recovery",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：CRC-validated streaming parser：fragmented input、malformed frame recovery\n\n範圍：履歷必答／實作深挖\n\n資料擷取的payload含0x00。測試工具卻用strlen或文字行切割計算長度。你如何發現與修正這種假通過？\n\n主管追問：\n1. parser的長度單位到底是bytes還是字元？\n2. Python測試程式在bytes與str間轉換有什麼損失？\n3. 換行與0xFF對log和傳輸各會造成什麼誤判？\n4. 你如何保存原始失敗輸入而不受編碼影響？",
    "reference": "### 判分要點\n- 二進位資料必須顯式帶長度\n- 文字編碼與原始bytes分離\n- 測試oracle與log不得默默截斷或替換資料\n\n### 必須拿出的證據\n提供含NUL、換行、高位bytes及任意payload的往返測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "CRC-validated streaming parser：fragmented input、malformed frame recovery"
    },
    "sources": []
  },
  {
    "id": "CV057",
    "group": "resume",
    "title": "驗證後 buffer 被改了",
    "topic": "05 CRC 與串流復原",
    "scope": "resume",
    "basis": "CRC-validated streaming parser：fragmented input、malformed frame recovery",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：CRC-validated streaming parser：fragmented input、malformed frame recovery\n\n範圍：履歷必答／實作深挖\n\n你先對ring裡的payload驗CRC，再把pointer交給別的工作。使用前buffer被重用，CRC還能保證拿到的是驗過的資料嗎？\n\n主管追問：\n1. 驗證與使用之間的時間窗口由誰保護？\n2. 只保存CRC值能否讓舊pointer重新有效？\n3. 複製、pin與generation檢查如何各自處理此問題？\n4. 哪一個測試能強迫驗證後立刻重用同一區域？",
    "reference": "### 判分要點\n- 完整性保證只適用被驗的那份內容\n- TOCTOU與生命週期需要另外同步或保留儲存\n- generation不能替代可用資料本身\n\n### 必須拿出的證據\n畫出驗證、發布、重用與使用的交錯時序。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "CRC-validated streaming parser：fragmented input、malformed frame recovery"
    },
    "sources": []
  },
  {
    "id": "CV058",
    "group": "resume",
    "title": "你的 parser 是否保證前進",
    "topic": "05 CRC 與串流復原",
    "scope": "resume",
    "basis": "CRC-validated streaming parser：fragmented input、malformed frame recovery",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：CRC-validated streaming parser：fragmented input、malformed frame recovery\n\n範圍：履歷必答／實作深挖\n\nfeed回傳MORE但consumed=0，上層不斷用同一段輸入重試。請定義不會死循環的進度契約。\n\n主管追問：\n1. 哪種情況合法回傳0 consumption？\n2. input不足與output背壓要不要用不同狀態？\n3. 每次最多交付一筆時，上層如何處理剩餘輸入？\n4. bad frame復原是否可能反覆停在同一個byte？",
    "reference": "### 判分要點\n- 設計可驗證的進度量\n- 缺輸入、缺輸出空間與錯誤分開\n- 非空輸入下要有前進或明確等待條件\n\n### 必須拿出的證據\n用步數上限驗證每個feed結果，展示一個會卡住的錯誤caller。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "CRC-validated streaming parser：fragmented input、malformed frame recovery"
    },
    "sources": []
  },
  {
    "id": "CV059",
    "group": "resume",
    "title": "協議升版不能默默破壞舊資料",
    "topic": "05 CRC 與串流復原",
    "scope": "resume",
    "basis": "CRC-validated streaming parser：fragmented input、malformed frame recovery",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：CRC-validated streaming parser：fragmented input、malformed frame recovery\n\n範圍：履歷必答／實作深挖\n\n新版本多了一個欄位，但舊服務仍在部署。如何設計版本、長度與保留bits，避免把新frame誤讀成舊frame？\n\n主管追問：\n1. 不支援版本是拒絕、略過還是降級？\n2. unknown optional欄位如何跳過，mandatory欄位如何處理？\n3. CRC覆蓋範圍改變如何識別？\n4. 新舊版本互通測試要包含哪些方向？",
    "reference": "### 判分要點\n- 版本與長度必須明確且可解析\n- 未知必要欄位不能默默忽略\n- 降級不能繞過完整性或資源限制\n\n### 必須拿出的證據\n給出相容性矩陣與版本/長度/保留bits組合測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "CRC-validated streaming parser：fragmented input、malformed frame recovery"
    },
    "sources": []
  },
  {
    "id": "CV060",
    "group": "resume",
    "title": "CRC 跨 chunk 的狀態不能重置錯",
    "topic": "05 CRC 與串流復原",
    "scope": "resume",
    "basis": "CRC-validated streaming parser：fragmented input、malformed frame recovery",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：CRC-validated streaming parser：fragmented input、malformed frame recovery\n\n範圍：履歷必答／實作深挖\n\n同一筆frame分成十個chunk。你每次呼叫都重新初始化CRC，最後只驗最後一段。請說明正確的狀態管理。\n\n主管追問：\n1. init與final xor各應在哪個階段套用？\n2. 使用library的incremental API時，state是否已經finalize？\n3. 錯誤frame或重連後，CRC狀態與parser狀態如何一起重置？\n4. 如何用一筆資料的所有切割點驗證同一結果？",
    "reference": "### 判分要點\n- 保存未完成frame的CRC累積狀態\n- 初始化與finalization不能重複套用\n- reset規則與frame邊界一致\n\n### 必須拿出的證據\n以單次計算與incremental計算交叉驗證，含空payload與錯誤後下一筆。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "CRC-validated streaming parser：fragmented input、malformed frame recovery"
    },
    "sources": []
  },
  {
    "id": "CV061",
    "group": "resume",
    "title": "你到底用了幾個 thread",
    "topic": "06 並行與關閉時序",
    "scope": "resume",
    "basis": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown\n\n範圍：履歷必答／實作深挖\n\n先畫出你專案實際的thread/process模型。若是單執行緒，也要說明哪些非同步事件仍會打斷你的假設。\n\n主管追問：\n1. 每個fd、parser與queue由誰擁有？\n2. signal handler能接觸哪些狀態？\n3. 改成多worker後哪個原本不需鎖的欄位變shared？\n4. 哪些工作會阻塞整個event loop？",
    "reference": "### 判分要點\n- 先交代真實架構，不把設計提案當實作\n- 區分thread並行、signal與裝置非同步\n- 所有共享狀態都有擁有者\n\n### 必須拿出的證據\n提供執行單元圖及每個共享資源的存取表。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown"
    },
    "sources": [
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV062",
    "group": "resume",
    "title": "condition variable 不會替你記住事件",
    "topic": "06 並行與關閉時序",
    "scope": "resume",
    "basis": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown\n\n範圍：履歷必答／實作深挖\n\nconsumer檢查queue為空，producer剛好push並signal，consumer才開始wait。請解釋怎麼避免永遠睡下去。\n\n主管追問：\n1. predicate與wait要在哪把mutex下操作？\n2. 為什麼醒來後仍然要用while重查條件？\n3. signal發生時沒有waiter，系統靠什麼保留可讀狀態？\n4. shutdown也要進入同一個predicate嗎？",
    "reference": "### 判分要點\n- condition是共享狀態而不是signal本身\n- 檢查與進入等待需使用正確mutex協議\n- 允許spurious wakeup並重新驗條件\n\n### 必須拿出的證據\n畫出錯誤與正確兩種交錯，提供可控制barrier的重現測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown"
    },
    "sources": [
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV063",
    "group": "resume",
    "title": "兩把鎖把關閉卡死",
    "topic": "06 並行與關閉時序",
    "scope": "resume",
    "basis": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown\n\n範圍：履歷必答／實作深挖\n\nI/O thread拿queue lock後要connection lock，shutdown thread反過來。請把死鎖畫出來並提出修法。\n\n主管追問：\n1. 全域鎖順序如何定義並檢查？\n2. join時仍持有worker需要的鎖會發生什麼？\n3. 把全部鎖合成一把有哪些成本？\n4. timeout為什麼不等於從根本消除死鎖？",
    "reference": "### 判分要點\n- 畫出等待環並選定一致鎖順序\n- 阻塞等待與join不能持有對方完成所需資源\n- 比較細鎖與粗鎖的可驗證取捨\n\n### 必須拿出的證據\n提供鎖順序表與能觸發反向路徑的壓力測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown"
    },
    "sources": [
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV064",
    "group": "resume",
    "title": "SIGTERM handler 裡不能做完整清理",
    "topic": "06 並行與關閉時序",
    "scope": "resume",
    "basis": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown\n\n範圍：履歷必答／實作深挖\n\n你在signal handler裡printf、malloc、加mutex並close一堆fd。請指出哪些風險以及正確交接方式。\n\n主管追問：\n1. 哪些操作需要async-signal-safe保證？\n2. volatile sig_atomic_t是否也能當一般thread同步？\n3. self-pipe、signalfd或ppoll各適合什麼模型？\n4. signal發生於資源初始化一半時，清理怎麼避免double free？",
    "reference": "### 判分要點\n- handler應限制為可安全執行的最小工作\n- 交由正常流程按狀態清理\n- signal安全與thread同步不是同一套保證\n\n### 必須拿出的證據\n列出實際handler內容與主流程接收停止通知的方式。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown"
    },
    "sources": [
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV065",
    "group": "resume",
    "title": "優雅關閉到底等多久",
    "topic": "06 並行與關閉時序",
    "scope": "resume",
    "basis": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown\n\n範圍：履歷必答／實作深挖\n\nSIGTERM到達時queue還有資料、client不再讀、worker有部分I/O。請定義能在固定時間內離開的shutdown。\n\n主管追問：\n1. drain與abort的交付語意各是什麼？\n2. 停止接新資料、喚醒worker、flush、join與close的順序為何？\n3. deadline到期時，如何記錄未交付資料？\n4. shutdown再被呼叫一次是否破壞狀態？",
    "reference": "### 判分要點\n- 有界關閉需要deadline與可取消等待\n- 明確區分接收停止、排空與強制終止\n- 資源回收依單向狀態推進\n\n### 必須拿出的證據\n提供每個關閉階段的最長時間及滿queue+斷線測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown"
    },
    "sources": [
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV066",
    "group": "resume",
    "title": "取消不能抹掉已發生的副作用",
    "topic": "06 並行與關閉時序",
    "scope": "resume",
    "basis": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown\n\n範圍：履歷必答／實作深挖\n\n一筆傳輸已送出60%，使用者按cancel。你要回傳取消、成功還是部分完成？\n\n主管追問：\n1. caller如何知道哪些bytes已被對端接受？\n2. callback與cancel同時完成時，如何避免回報兩次？\n3. 重試是否能保證不重複執行？\n4. 物件何時才可以釋放，晚到的通知怎麼處理？",
    "reference": "### 判分要點\n- 取消不是時間倒流\n- 回報進度與終止狀態需有唯一提交者\n- 副作用與可重試性要由協議明確定義\n\n### 必須拿出的證據\n畫出完成/cancel競爭與一次性通知機制。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown"
    },
    "sources": [
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV067",
    "group": "resume",
    "title": "reconnect 的舊 callback 又回來了",
    "topic": "06 並行與關閉時序",
    "scope": "resume",
    "basis": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown\n\n範圍：履歷必答／實作深挖\n\n新session已建立，但舊session的一個timer或callback才執行。它看到相同fd與buffer位址。如何防止污染新狀態？\n\n主管追問：\n1. session identity是否獨立於fd與記憶體位址？\n2. callback拿到物件時如何保證還活著？\n3. 取消timer成功是否保證callback已不在執行？\n4. reset parser與丟棄queue的操作誰負責串行化？",
    "reference": "### 判分要點\n- 代次驗證與物件生命週期需同時成立\n- 取消註冊不一定等於等待已開始的工作結束\n- 新舊session狀態隔離\n\n### 必須拿出的證據\n提供代次、引用與停止流程的具體時序。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown"
    },
    "sources": [
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV068",
    "group": "resume",
    "title": "worker 卡在無限阻塞怎麼 join",
    "topic": "06 並行與關閉時序",
    "scope": "resume",
    "basis": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown\n\n範圍：履歷必答／實作深挖\n\n主thread已設定stop，但worker卡在blocking write或等待永遠不會來的資料。你怎麼讓join有界？\n\n主管追問：\n1. stop flag為什麼不會自動中斷阻塞syscall？\n2. 同時從其他thread close fd是否足以形成可靠取消協議？\n3. 非阻塞I/O加wake fd與deadline能解決哪部分？\n4. 若callback本身沒有時間界線，整體能宣稱有界嗎？",
    "reference": "### 判分要點\n- 停止通知與解除阻塞必須設計成同一協議\n- 不能只靠flag或假設close行為\n- 依賴的blocking操作要有退出路徑\n\n### 必須拿出的證據\n列出每個等待點與對應喚醒/取消機制。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown"
    },
    "sources": [
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV069",
    "group": "resume",
    "title": "統計 counter 也可能讓程式錯",
    "topic": "06 並行與關閉時序",
    "scope": "resume",
    "basis": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown\n\n範圍：履歷必答／實作深挖\n\n為了低成本統計，你讓多thread直接++同一個普通整數。這只是數字不準，還是更嚴重？\n\n主管追問：\n1. C data race的語言結果是什麼？\n2. atomic relaxed什麼時候適合純計數？\n3. 讀兩個counter相減時，是否得到同一時刻快照？\n4. cache line共享與false sharing會如何影響效能？",
    "reference": "### 判分要點\n- 普通共享修改可形成UB\n- 純統計與發布資料使用不同ordering需求\n- 多欄位快照和cache成本需另處理\n\n### 必須拿出的證據\n提供counter的語意、同步選擇與量測開銷。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown"
    },
    "sources": [
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV070",
    "group": "resume",
    "title": "sleep 一秒不是競態測試",
    "topic": "06 並行與關閉時序",
    "scope": "resume",
    "basis": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown\n\n範圍：履歷必答／實作深挖\n\n你的race test靠兩個thread各sleep一下，希望剛好撞到。如何把它改成可控制的反例？\n\n主管追問：\n1. 用barrier或hook固定哪個檢查點？\n2. TSan沒有報告能證明邏輯協議正確嗎？\n3. 如何測shutdown、disconnect與queue滿同時發生？\n4. 失敗後怎麼保存足夠時序資訊而不嚴重干擾執行？",
    "reference": "### 判分要點\n- 用可控排程點構造特定交錯\n- 工具報告與邏輯不變數測試互補\n- 記錄seed、狀態與事件順序\n\n### 必須拿出的證據\n展示不用碰運氣也能重現的競態與修正前後結果。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown"
    },
    "sources": [
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV071",
    "group": "resume",
    "title": "第一個錯誤被後面的錯誤蓋掉",
    "topic": "06 並行與關閉時序",
    "scope": "resume",
    "basis": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown\n\n範圍：履歷必答／實作深挖\n\n讀取端失敗後觸發shutdown，寫入端接著EPIPE，最後只留下EPIPE。你怎麼保留真正起因？\n\n主管追問：\n1. 錯誤事件應包含哪些context與session identity？\n2. 多worker同時失敗時，誰決定root-cause候選？\n3. 清理失敗與原始工作失敗如何同時回報？\n4. log限流後還能保留哪些最小證據？",
    "reference": "### 判分要點\n- 保留初始失敗與後續因果鏈\n- 錯誤彙總要有一次性主因與可追加清理結果\n- 避免用最後一個errno取代全局原因\n\n### 必須拿出的證據\n提供結構化錯誤事件範例與兩條同時失敗的測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown"
    },
    "sources": [
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV072",
    "group": "resume",
    "title": "讀到半套狀態的管理介面",
    "topic": "06 並行與關閉時序",
    "scope": "resume",
    "basis": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown\n\n範圍：履歷必答／實作深挖\n\n監控thread讀到used已增加但head尚未更新，計算出不可能的queue狀態。你如何提供一致的快照？\n\n主管追問：\n1. mutex快照、sequence counter與獨立統計各有什麼限制？\n2. 讀者是否可能在sequence counter上無限重試？\n3. 哪些指標允許近似，哪些會驅動控制決策？\n4. 如果用快照做資源釋放，錯誤風險為什麼更大？",
    "reference": "### 判分要點\n- 多欄位一致性不能靠各自atomic就自動取得\n- 區分觀測與控制用途\n- 選擇適合資料與上下文的快照協議\n\n### 必須拿出的證據\n給出可觀測不變數與讀寫交錯下的合法快照範圍。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Linux service：測試 slow consumer、disconnect、reconnect 與 SIGTERM shutdown"
    },
    "sources": [
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV073",
    "group": "resume",
    "title": "你的 FIFO 到底提供什麼語意",
    "topic": "07 FIFO driver 與 user copy",
    "scope": "resume",
    "basis": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers\n\n範圍：履歷必答／實作深挖\n\n先寫下這個character device的read/write契約。不要把它自動當成Linux named pipe，也不要借用沒有實作的保證。\n\n主管追問：\n1. 空FIFO的blocking與O_NONBLOCK行為分別是什麼？\n2. 多個open共用一個queue，還是每個file各有一個？\n3. 資料單位是byte stream還是message，邊界會保留嗎？\n4. 停止或移除裝置後，剩餘資料與新I/O如何處理？",
    "reference": "### 判分要點\n- 先定義裝置自己的介面契約\n- PIPE_BUF等pipe保證不會自動套到自訂driver\n- 共享範圍、短I/O與終止行為須一致\n\n### 必須拿出的證據\n提供fops行為表、errno約定與多client測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      }
    ]
  },
  {
    "id": "CV074",
    "group": "resume",
    "title": "copy_to_user 回傳 3 是什麼意思",
    "topic": "07 FIFO driver 與 user copy",
    "scope": "resume",
    "basis": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers\n\n範圍：履歷必答／實作深挖\n\n你要求copy_to_user複製8 bytes，它回傳3。請說明已發生什麼、read應回傳什麼，以及FIFO應前進多少。\n\n主管追問：\n1. 回傳值是已複製、未複製，還是負errno？\n2. 先從FIFO移除8 bytes再copy，fault後會丟掉哪些資料？\n3. 已成功複製5 bytes時，一律回-EFAULT會造成什麼caller誤解？\n4. copy期間另一個reader能不能改變你選定的來源？",
    "reference": "### 判分要點\n- 標準user-copy回報未複製量，例中成功5 bytes\n- 短讀與全失敗的回報需反映進度\n- 資料提交和並行讀取必須配合\n\n### 必須拿出的證據\n提供跨可讀/不可讀user頁面的測試與FIFO剩餘內容。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      }
    ]
  },
  {
    "id": "CV075",
    "group": "resume",
    "title": "spinlock 裡面能不能 copy_to_user",
    "topic": "07 FIFO driver 與 user copy",
    "scope": "resume",
    "basis": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers\n\n範圍：履歷必答／實作深挖\n\n為了保護FIFO，你從檢查到copy_to_user都持有spinlock。為什麼這可能違反執行上下文要求？\n\n主管追問：\n1. user page fault可能導致哪些睡眠路徑？\n2. 換mutex是否立即解決所有延遲與競態？\n3. 先複製到kernel暫存再釋鎖，會改變哪些提交契約？\n4. 如果資料來自IRQ，哪部分需要移到可睡眠上下文？",
    "reference": "### 判分要點\n- 一般user-copy可能fault並睡眠，不應放在不可睡眠的spinlocked區域\n- 選鎖依上下文\n- 暫存與提交需維持並行及部分失敗語意\n\n### 必須拿出的證據\n指出實際使用的鎖、其保護欄位與copy階段的所有權。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      }
    ]
  },
  {
    "id": "CV076",
    "group": "resume",
    "title": "wait queue 的遺失喚醒",
    "topic": "07 FIFO driver 與 user copy",
    "scope": "resume",
    "basis": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers\n\n範圍：履歷必答／實作深挖\n\nreader看到空queue準備睡，writer剛好寫完並wake。畫出你的等待協議，證明不會永遠睡下去。\n\n主管追問：\n1. wait_event的predicate讀取如何與寫入端同步？\n2. 醒來後條件被另一個reader搶走了怎麼辦？\n3. signal中斷等待時kernel與userspace各看到什麼結果？\n4. 移除裝置時predicate只看非空會留下什麼問題？",
    "reference": "### 判分要點\n- 等待的是狀態而非一次wake事件\n- 使用正確等待與鎖定協議並重查條件\n- predicate包含dying/stop等終止狀態\n\n### 必須拿出的證據\n提供可控制交錯的測試，區分正常喚醒、signal與remove。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      }
    ]
  },
  {
    "id": "CV077",
    "group": "resume",
    "title": "EAGAIN 的檢查不能與操作分家",
    "topic": "07 FIFO driver 與 user copy",
    "scope": "resume",
    "basis": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers\n\n範圍：履歷必答／實作深挖\n\nO_NONBLOCK writer檢查到有空間，但還沒真正寫入就被別人填滿。你要在哪個位置做最終判斷？\n\n主管追問：\n1. 檢查與保留空間之間需要什麼同步？\n2. 短寫與EAGAIN的界線怎麼定義？\n3. 同一個file被dup或跨thread共用時，flag與狀態如何影響？\n4. 如果改成先保留再copy，fault時如何回收保留量？",
    "reference": "### 判分要點\n- 狀態檢查與實際提交/保留必須有同一一致性協議\n- 正進度與零進度錯誤分開\n- 非阻塞不代表無需同步\n\n### 必須拿出的證據\n列出兩writer交錯與user fault的測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      }
    ]
  },
  {
    "id": "CV078",
    "group": "resume",
    "title": "wake_up 不是把資料分配給某個 reader",
    "topic": "07 FIFO driver 與 user copy",
    "scope": "resume",
    "basis": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers\n\n範圍：履歷必答／實作深挖\n\n十個reader都在等一個FIFO，只加入一個byte。你呼叫wake_up_all後，會有十個reader成功嗎？\n\n主管追問：\n1. 被喚醒但搶不到資料的reader該做什麼？\n2. exclusive wait與全部喚醒各有什麼效能與公平性代價？\n3. 讀出資料後，何時應喚醒等待空間的writer？\n4. 錯誤地只wake讀者會造成哪一種停滯？",
    "reference": "### 判分要點\n- wake只讓等待者重新競爭與檢查條件\n- 資料量和成功次數不能混淆\n- 讀寫兩類waiter需在相應狀態改變時被通知\n\n### 必須拿出的證據\n提供多reader/multiwriter狀態與喚醒次數的測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      }
    ]
  },
  {
    "id": "CV079",
    "group": "resume",
    "title": "兩個 writer 的資料會怎麼交錯",
    "topic": "07 FIFO driver 與 user copy",
    "scope": "resume",
    "basis": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers\n\n範圍：履歷必答／實作深挖\n\n兩個process各write一個16-byte記錄，FIFO剩12 bytes。你的driver會接受哪部分，是否保證記錄不交錯？\n\n主管追問：\n1. 這是你自訂的原子性，還是誤以為所有FIFO都自帶？\n2. 若允許短寫，上層如何維持message framing？\n3. 整筆原子寫要求如何影響等待條件與大訊息？\n4. 一個超過總容量的記錄是否可能永遠等不到？",
    "reference": "### 判分要點\n- 明確區分byte stream和record原子性\n- 自訂char driver不自動繼承pipe原子寫規則\n- 大於容量的要求需定義拒絕或分段\n\n### 必須拿出的證據\n給出兩writer逐byte/逐記錄的合法結果集合。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      }
    ]
  },
  {
    "id": "CV080",
    "group": "resume",
    "title": "reset ioctl 正好撞上 read",
    "topic": "07 FIFO driver 與 user copy",
    "scope": "resume",
    "basis": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers\n\n範圍：履歷必答／實作深挖\n\nioctl清空FIFO時，一個reader已選好來源但正在user copy。你如何避免丟失、重複或讀到新資料？\n\n主管追問：\n1. reset的線性化點在哪裡？\n2. copy階段資料是否已被reader獨占或暫存？\n3. blocked writer/reader要不要因reset被喚醒？\n4. reset是否保留統計、generation或未完成操作？",
    "reference": "### 判分要點\n- reset必須納入同一並行協議\n- 交代既有I/O與清空動作的先後語意\n- 不能只把index設零就宣稱安全\n\n### 必須拿出的證據\n畫出read/reset/write三方交錯，列出每個允許結果。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      }
    ]
  },
  {
    "id": "CV081",
    "group": "resume",
    "title": "file position 在你的裝置代表什麼",
    "topic": "07 FIFO driver 與 user copy",
    "scope": "resume",
    "basis": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers\n\n範圍：履歷必答／實作深挖\n\n我對你的裝置呼叫lseek，或傳入不同位置讀寫。你的driver應如何回應，為什麼？\n\n主管追問：\n1. f_pos有沒有實際語意，還是應視為不可seek的stream？\n2. read callback的ppos是否被錯用成全域FIFO索引？\n3. 兩個file共享或不共享offset時會不會改變queue行為？\n4. 你採用的kernel helper與版本對應是否確認過？",
    "reference": "### 判分要點\n- stream裝置和有位址空間裝置的position契約不同\n- per-file位置不能隨意取代全域queue狀態\n- 確認實際fops與helper語意\n\n### 必須拿出的證據\n展示lseek、dup及多次open下的測試與實際回傳。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      }
    ]
  },
  {
    "id": "CV082",
    "group": "resume",
    "title": "count=0 還會去睡嗎",
    "topic": "07 FIFO driver 與 user copy",
    "scope": "resume",
    "basis": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers\n\n範圍：履歷必答／實作深挖\n\nread或write收到count=0。你的程式先進wait queue，結果測試永遠卡住。請定義這個邊界。\n\n主管追問：\n1. 零長度操作需不需要取得資料或空間？\n2. user pointer為NULL但count=0時，你的driver契約是什麼？\n3. 停止狀態與零長度要求的優先順序如何定義？\n4. 如何避免測試只看return=0而沒發現狀態被改了？",
    "reference": "### 判分要點\n- 零長度應依明確介面規範處理，不能無理由等待資料\n- 檢查狀態、copy與metadata不應產生意外副作用\n- 不要把零長度read與EOF混為一談\n\n### 必須拿出的證據\n提供零長度在空、滿、停止與無效pointer條件下的測試矩陣。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      }
    ]
  },
  {
    "id": "CV083",
    "group": "resume",
    "title": "使用者記憶體不是一次檢查就永遠安全",
    "topic": "07 FIFO driver 與 user copy",
    "scope": "resume",
    "basis": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers\n\n範圍：履歷必答／實作深挖\n\n你先access_ok成功，再直接解參照user pointer。為什麼這不等於安全？\n\n主管追問：\n1. 另一個thread改mapping時，先前檢查還能保證什麼？\n2. copy_from_user未完成時，哪些kernel資料已可被視為有效？\n3. 為什麼不能把user pointer存起來交給任意晚到工作使用？\n4. 需要非同步存取user頁面時，pin與壽命管理還增加什麼責任？",
    "reference": "### 判分要點\n- user pointer須透過適當user-access機制\n- 範圍檢查不保證未來存取成功\n- 非同步頁面存取需要專門生命週期與pin協議\n\n### 必須拿出的證據\n給出fault注入、mapping變化與部分copy的重現方案。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      }
    ]
  },
  {
    "id": "CV084",
    "group": "resume",
    "title": "driver 測試不准只跑 cat 和 echo",
    "topic": "07 FIFO driver 與 user copy",
    "scope": "resume",
    "basis": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers\n\n範圍：履歷必答／實作深挖\n\ncat/echo都能用，只證明最簡單路徑。請提出能攻擊並行與user-copy語意的測試組。\n\n主管追問：\n1. 怎麼製造跨頁partial fault，而非只有整個NULL？\n2. signal、O_NONBLOCK與短I/O怎麼交叉組合？\n3. KASAN、KCSAN與lockdep各能幫哪類問題？\n4. 工具全部安靜時，你還需要哪些資料守恆與時序測試？",
    "reference": "### 判分要點\n- 工具偵測與介面性質互補\n- 涵蓋partial copy、等待中斷及多client\n- 測試需核對內容與進度而非只有不當機\n\n### 必須拿出的證據\n提供一個可自動重跑的並行測試及失敗診斷資料。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Concurrent Linux FIFO Driver：blocking/nonblocking I/O、wait queues、locking、partial transfers、invalid user pointers"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      }
    ]
  },
  {
    "id": "CV085",
    "group": "resume",
    "title": "remove 之後已 open 的 fd 還活著",
    "topic": "08 Driver 壽命與 UAPI",
    "scope": "resume",
    "basis": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU\n\n範圍：履歷必答／實作深挖\n\n裝置remove時仍有process持有fd。你呼叫cdev_del並釋放buffer，舊fd下一次read會怎樣？\n\n主管追問：\n1. 禁止新open與使既有file失效是否同一件事？\n2. device instance由哪個reference保住？\n3. devm資源何時釋放，能不能直接依賴它保住舊fd？\n4. 最後一個release之前，哪些東西仍必須有效？",
    "reference": "### 判分要點\n- 移除註冊不自動回收既有file\n- module與device instance有不同生命週期\n- dying狀態、引用與最終釋放需協調\n\n### 必須拿出的證據\n畫出probe/open/remove/read/release的完整生命週期。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV086",
    "group": "resume",
    "title": "open 和 remove 同時發生",
    "topic": "08 Driver 壽命與 UAPI",
    "scope": "resume",
    "basis": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU\n\n範圍：履歷必答／實作深挖\n\nopen正在取得private_data的同時，remove把狀態改成dying並丟掉最後一個引用。你怎麼阻止use-after-free？\n\n主管追問：\n1. 查找到instance與取得reference之間是否有窗口？\n2. 哪個lock或註冊機制保護這個交接？\n3. open失敗時已取得的引用由誰歸還？\n4. 如何在測試中強迫open停在危險位置？",
    "reference": "### 判分要點\n- 引用必須在物件仍受保護時取得\n- 查找、dying檢查與get需要可證明的協議\n- 所有失敗路徑平衡引用\n\n### 必須拿出的證據\n提供狀態/引用計數圖與可控制交錯的remove測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV087",
    "group": "resume",
    "title": "poll_wait 的順序為什麼重要",
    "topic": "08 Driver 壽命與 UAPI",
    "scope": "resume",
    "basis": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU\n\n範圍：履歷必答／實作深挖\n\n你的poll callback先檢查queue空，再呼叫poll_wait。資料剛好在中間到達，會發生什麼事？\n\n主管追問：\n1. 註冊等待與讀取ready條件應如何搭配？\n2. poll callback是否應真的睡在wait_event裡？\n3. reader與writer各需要註冊哪個wait queue？\n4. ready只是當下快照，userspace為何仍需處理EAGAIN？",
    "reference": "### 判分要點\n- poll_wait註冊poll等待關係而不是在callback阻塞\n- 遵循先註冊再依同步規則檢查狀態的常用協議\n- readiness不是資源預約\n\n### 必須拿出的證據\n提供事件落在兩步之間的時序與poll/read競爭測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV088",
    "group": "resume",
    "title": "POLLHUP 不一定排除 POLLIN",
    "topic": "08 Driver 壽命與 UAPI",
    "scope": "resume",
    "basis": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU\n\n範圍：履歷必答／實作深挖\n\n裝置已停止但FIFO仍有資料。你準備只回POLLHUP。這符合你對剩餘資料的契約嗎？\n\n主管追問：\n1. 是先drain再EOF，還是立即回ENODEV？\n2. read、poll與blocked waiter的觀察是否一致？\n3. 什麼情況同時回readable與hangup合理？\n4. 停止後writer看到什麼，會不會持續被喚醒忙等？",
    "reference": "### 判分要點\n- 先定義停止後資料政策\n- poll與read/write必須對同一狀態給一致解釋\n- terminal與ready可以同時存在\n\n### 必須拿出的證據\n列出空/非空/滿與alive/dying的事件矩陣。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV089",
    "group": "resume",
    "title": "ioctl 不能把 sizeof 寫兩次",
    "topic": "08 Driver 壽命與 UAPI",
    "scope": "resume",
    "basis": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU\n\n範圍：履歷必答／實作深挖\n\n你用_IOR建立GET_STATS命令，第三個參數卻傳sizeof(struct stats)。這會把哪個大小編進命令？\n\n主管追問：\n1. _IO、_IOR、_IOW、_IOWR從誰的方向命名？\n2. 未知command應回什麼類型錯誤，為何不是一律EINVAL？\n3. struct padding、long和pointer會怎麼破壞compat？\n4. 新版本欄位增加時如何避免默默改掉舊command ABI？",
    "reference": "### 判分要點\n- ioctl巨集第三參數應是型別而非sizeof結果\n- 固定UAPI布局並處理相容\n- 未知command通常對應ENOTTY語意，版本細節依實際kernel確認\n\n### 必須拿出的證據\n給出命令定義、sizeof/offset檢查與32/64-bit使用者相容測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV090",
    "group": "resume",
    "title": "讀 stats 時能不能把垃圾 padding 送出去",
    "topic": "08 Driver 壽命與 UAPI",
    "scope": "resume",
    "basis": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU\n\n範圍：履歷必答／實作深挖\n\nGET_STATS把kernel struct直接copy到userspace，幾個欄位有填，但padding沒初始化。你要怎麼避免洩漏？\n\n主管追問：\n1. 零初始化與逐欄位序列化各有什麼好處？\n2. stats需要一致快照時用什麼鎖？\n3. spinlock可以跨copy_to_user嗎？\n4. user buffer太短或有fault時，如何回報進度與錯誤？",
    "reference": "### 判分要點\n- UAPI輸出所有可見bytes都要可控\n- 在合適同步下取得snapshot，再在允許上下文copy\n- 資料布局與部分失敗需測試\n\n### 必須拿出的證據\n提供padding檢查及同時更新stats的snapshot測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV091",
    "group": "resume",
    "title": "Device Tree 節點存在卻沒有 probe",
    "topic": "08 Driver 壽命與 UAPI",
    "scope": "resume",
    "basis": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU\n\n範圍：履歷必答／實作深挖\n\ndts裡看得到節點，但probe完全沒被呼叫。請按證據排序排查，不准只說「compatible錯了」。\n\n主管追問：\n1. 正在跑的dtb真的是你改的那份嗎？\n2. status、父bus與compatible如何影響建立device及matching？\n3. driver是否真的built-in或已載入？\n4. deferred probe與根本沒match要怎麼區分？",
    "reference": "### 判分要點\n- 依實際啟動dtb、device建立、driver註冊與match逐層檢查\n- 區分disabled、缺dependency與probe錯誤\n- 不靠猜測一次改多個條件\n\n### 必須拿出的證據\n提供runtime device tree、sysfs、modalias與dmesg對照。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV092",
    "group": "resume",
    "title": "probe 第五步失敗要收回哪四步",
    "topic": "08 Driver 壽命與 UAPI",
    "scope": "resume",
    "basis": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU\n\n範圍：履歷必答／實作深挖\n\nprobe依序取得記憶體、設備號碼、cdev、class/device節點與其他資源。第五步失敗，請逐步回收。\n\n主管追問：\n1. 每個資源的配對釋放函式與取得成功條件是什麼？\n2. devm與手動cleanup混用會不會double free？\n3. 錯誤回傳之前，使用者能否已打開半初始化裝置？\n4. 每個取得點都失敗一次時，如何證明沒有殘留？",
    "reference": "### 判分要點\n- 依實際取得順序反向釋放\n- 公布可用介面前完成必要初始化\n- managed與manual所有權不得重複\n\n### 必須拿出的證據\n列出acquire/release表與每一步的失敗注入結果。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV093",
    "group": "resume",
    "title": "IRQ 版本的 teardown 會多出什麼",
    "topic": "08 Driver 壽命與 UAPI",
    "scope": "role_extension",
    "basis": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU",
    "level": "職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU\n\n範圍：職務延伸／極難\n\n假設把目前軟體FIFO接上真正IRQ來源。remove不能只free FIFO。請設計新的停止順序。\n\n主管追問：\n1. 如何先阻止裝置產生新的工作？\n2. 已在執行的IRQ、workqueue或timer如何等待結束？\n3. 持有callback需要的鎖時呼叫同步取消會怎樣？\n4. 裝置可能仍DMA到buffer時，何時才可釋放？",
    "reference": "### 判分要點\n- 這是職務延伸情境，不能聲稱履歷已實作IRQ/DMA\n- 停源、同步在途工作、終止waiter與最後釋放需形成順序\n- 不可讓硬體繼續存取已釋放記憶體\n\n### 必須拿出的證據\n畫出硬體活動、kernel callback、file引用與buffer回收的相依圖。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV094",
    "group": "resume",
    "title": "module 引用不等於 instance 引用",
    "topic": "08 Driver 壽命與 UAPI",
    "scope": "resume",
    "basis": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU\n\n範圍：履歷必答／實作深挖\n\n你說file_operations.owner=THIS_MODULE所以remove安全。這個推論漏掉了什麼？\n\n主管追問：\n1. owner保住的是module程式碼，還是哪一份device私有資料？\n2. 同一module支援兩個device時，壽命如何分開？\n3. platform unbind但module還在，private_data是否仍有效？\n4. 最後一個file釋放時，誰執行instance析構？",
    "reference": "### 判分要點\n- module卸載保護與device資料生命週期分開\n- per-instance引用與dying狀態不可省略\n- unbind不等於module unload\n\n### 必須拿出的證據\n提供兩instance與一個仍open fd的unbind測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV095",
    "group": "resume",
    "title": "QEMU 通過不等於真硬體通過",
    "topic": "08 Driver 壽命與 UAPI",
    "scope": "resume",
    "basis": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU\n\n範圍：履歷必答／實作深挖\n\n履歷寫在QEMU驗證probe/remove。你能合理宣稱哪些成果，還有哪些硬體風險沒有驗到？\n\n主管追問：\n1. 真實interrupt時序、DMA與cache-coherency驗到了嗎？\n2. 模擬器是否建模目標裝置及其錯誤行為？\n3. 移植到ARM板後，第一輪bring-up如何分層？\n4. 你會如何修改履歷或口述，避免把模擬測試講成量產驗證？",
    "reference": "### 判分要點\n- 說明QEMU機型與可見功能範圍\n- 功能模型不能替代真實硬體時序、電氣及效能驗證\n- 提出可操作的移植驗證計畫\n\n### 必須拿出的證據\n提供實際QEMU命令、機型、kernel版本與尚未驗證清單。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV096",
    "group": "resume",
    "title": "kernel 版本換了，你的假設還在嗎",
    "topic": "08 Driver 壽命與 UAPI",
    "scope": "resume",
    "basis": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU\n\n範圍：履歷必答／實作深挖\n\n我把driver移到另一個kernel版本。probe/remove型別、class建立與poll相關API可能不同。你怎麼做相容工作？\n\n主管追問：\n1. 哪一版是你真的編譯與測試過的？\n2. 你查header、文件還是只照網路片段改到能編過？\n3. 成功編譯後如何驗證生命週期語意仍一致？\n4. 是否需要compat層，還是明確限定支援版本較合理？",
    "reference": "### 判分要點\n- 先固定真實支援版本\n- API與語意一起核對\n- 避免用預處理分支掩蓋未測試組合，支援範圍需能維護\n\n### 必須拿出的證據\n提供版本矩陣與每版可重跑的build/runtime測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "FIFO driver：poll、ioctl、teardown、Device Tree matching、platform probe/remove、QEMU"
    },
    "sources": [
      {
        "title": "Kernel reference lifetimes",
        "url": "https://docs.kernel.org/core-api/kref.html"
      },
      {
        "title": "Linux ioctl interfaces",
        "url": "https://docs.kernel.org/driver-api/ioctl.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV097",
    "group": "resume",
    "title": "你真的有經過 U-Boot 嗎",
    "topic": "09 Buildroot 與開機整合",
    "scope": "resume",
    "basis": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks\n\n範圍：履歷必答／實作深挖\n\n畫出你那份QEMU ARM64映像從啟動到daemon ready的實際鏈路。不能用通用Linux開機圖代替。\n\n主管追問：\n1. QEMU是直接載kernel，還是載firmware後經過U-Boot？\n2. kernel、dtb、rootfs各由誰載入，位址與參數從哪裡來？\n3. bootloader成功與kernel開始執行如何分辨？\n4. 哪些步驟只是模擬平台提供，不是你實作的？",
    "reference": "### 判分要點\n- 以真實QEMU命令與console證明啟動路徑\n- 區分各階段責任與產物\n- 不能把direct-kernel boot描述成已驗證U-Boot整合\n\n### 必須拿出的證據\n提供完整啟動命令、產物名稱與對應console標記。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks"
    },
    "sources": [
      {
        "title": "Buildroot manual",
        "url": "https://buildroot.org/downloads/manual/manual.html"
      },
      {
        "title": "U-Boot booti",
        "url": "https://docs.u-boot.org/en/latest/usage/cmd/booti.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV098",
    "group": "resume",
    "title": "Image、dtb 與 initrd 放錯位址",
    "topic": "09 Buildroot 與開機整合",
    "scope": "resume",
    "basis": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks\n\n範圍：履歷必答／實作深挖\n\nU-Boot準備啟動ARM64 kernel，但載入區域互相覆蓋。你如何驗證記憶體布局而不是只換一個神奇位址？\n\n主管追問：\n1. 每個產物的大小、載入與執行位址怎麼取得？\n2. 壓縮映像解壓後是否還會覆蓋其他區域？\n3. booti或你實際用的命令各期待什麼格式？\n4. dtb內容有效但指標錯誤時，console可能在哪裡停住？",
    "reference": "### 判分要點\n- 核對實際平台memory map、映像格式與命令語意\n- 包含解壓/重定位需求\n- 用分階段證據定位而非隨機改位址\n\n### 必須拿出的證據\n提供你實際使用的載入位址、大小與boot命令。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks"
    },
    "sources": [
      {
        "title": "Buildroot manual",
        "url": "https://buildroot.org/downloads/manual/manual.html"
      },
      {
        "title": "U-Boot booti",
        "url": "https://docs.u-boot.org/en/latest/usage/cmd/booti.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV099",
    "group": "resume",
    "title": "BR2_EXTERNAL 不是把檔案塞進 output",
    "topic": "09 Buildroot 與開機整合",
    "scope": "resume",
    "basis": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks\n\n範圍：履歷必答／實作深挖\n\n你手改output/target後測試成功，clean build卻消失。請用可維護方式加入自訂daemon與啟動設定。\n\n主管追問：\n1. package的Config.in與.mk各負責什麼？\n2. 外部樹如何被指定，defconfig如何保留？\n3. overlay、post-build script與package install階段如何選？\n4. package變更後哪些rebuild命令真的會重新安裝到映像？",
    "reference": "### 判分要點\n- 自訂內容必須進可追蹤來源與Buildroot整合入口\n- output是產物\n- 建置、安裝與映像重建階段要分清楚\n\n### 必須拿出的證據\n提供BR2_EXTERNAL結構、package規則與從clean狀態建置的證據。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks"
    },
    "sources": [
      {
        "title": "Buildroot manual",
        "url": "https://buildroot.org/downloads/manual/manual.html"
      },
      {
        "title": "U-Boot booti",
        "url": "https://docs.u-boot.org/en/latest/usage/cmd/booti.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV100",
    "group": "resume",
    "title": "CMake 怎麼知道你在 cross compile",
    "topic": "09 Buildroot 與開機整合",
    "scope": "resume",
    "basis": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks\n\n範圍：履歷必答／實作深挖\n\ndaemon在host能跑，放進ARM64 rootfs卻無法執行。請從CMake到ELF檢查整條鏈。\n\n主管追問：\n1. compiler、sysroot與target flags分別由誰提供？\n2. configure階段try_run在cross情境怎麼處理？\n3. 如何避免誤link到host的library？\n4. readelf、file與動態載入器路徑各能告訴你什麼？",
    "reference": "### 判分要點\n- 使用正確toolchain與sysroot並檢查產物架構/ABI\n- 不能只看CMake成功\n- configure時執行target程式需要明確處理\n\n### 必須拿出的證據\n提供toolchain設定、link命令與target ELF資訊。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks"
    },
    "sources": [
      {
        "title": "Buildroot manual",
        "url": "https://buildroot.org/downloads/manual/manual.html"
      },
      {
        "title": "U-Boot booti",
        "url": "https://docs.u-boot.org/en/latest/usage/cmd/booti.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV101",
    "group": "resume",
    "title": "唯讀 rootfs 還有哪些地方會寫",
    "topic": "09 Buildroot 與開機整合",
    "scope": "resume",
    "basis": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks\n\n範圍：履歷必答／實作深挖\n\n你把rootfs設成read-only，daemon、log與系統服務仍然需要寫入。列出真正的可寫路徑及生命週期。\n\n主管追問：\n1. tmpfs、資料分割區與overlay各保留什麼？\n2. /run、/tmp、/var與配置檔由誰建立？\n3. 資料分割區未掛載時，服務是否誤寫到底下的目錄？\n4. 重開機與斷電後，哪些資料應存在、哪些應消失？",
    "reference": "### 判分要點\n- 依用途區分揮發與持久資料\n- 掛載依賴與目錄權限必須可驗證\n- 唯讀root不自動提供資料一致性或更新保證\n\n### 必須拿出的證據\n提供mount table、寫入路徑清單與缺少資料盤的啟動測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks"
    },
    "sources": [
      {
        "title": "Buildroot manual",
        "url": "https://buildroot.org/downloads/manual/manual.html"
      },
      {
        "title": "U-Boot booti",
        "url": "https://docs.u-boot.org/en/latest/usage/cmd/booti.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV102",
    "group": "resume",
    "title": "VFS 無法掛載 root 的第一個證據",
    "topic": "09 Buildroot 與開機整合",
    "scope": "resume",
    "basis": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks\n\n範圍：履歷必答／實作深挖\n\nconsole顯示無法mount root。你只能看serial log，請用有順序的假說樹排查。\n\n主管追問：\n1. root=參數、裝置列舉與實際分割區是否一致？\n2. 儲存驅動與filesystem支援是否built-in，還是卡在需要rootfs才可載module？\n3. DT disabled、錯誤驅動與檔案系統損壞如何區分？\n4. rootwait能解決什麼，不能解決什麼？",
    "reference": "### 判分要點\n- 先確認裝置是否出現，再確認指定對象、驅動及filesystem\n- 避免用等待參數掩蓋根本不存在的裝置\n- 保留第一個失敗訊息\n\n### 必須拿出的證據\n提供真實mount失敗log與逐項排除過程。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks"
    },
    "sources": [
      {
        "title": "Buildroot manual",
        "url": "https://buildroot.org/downloads/manual/manual.html"
      },
      {
        "title": "U-Boot booti",
        "url": "https://docs.u-boot.org/en/latest/usage/cmd/booti.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV103",
    "group": "resume",
    "title": "daemon 起太早造成假成功",
    "topic": "09 Buildroot 與開機整合",
    "scope": "resume",
    "basis": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks\n\n範圍：履歷必答／實作深挖\n\n啟動script回傳成功，但資料盤還沒mount、socket還沒ready。你如何定義真正的ready與相依順序？\n\n主管追問：\n1. process存在與服務可用如何區分？\n2. init system是BusyBox init、systemd還是其他？\n3. 重試與重啟風暴怎麼限制？\n4. 停止script如何確認舊程序真的離開，避免兩個instance？",
    "reference": "### 判分要點\n- 啟動與ready是不同狀態\n- 依真實init模型定義相依、失敗與重啟\n- 退出及單instance保證要可觀察\n\n### 必須拿出的證據\n提供實際init腳本與依賴缺失/啟動失敗/停止超時的測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks"
    },
    "sources": [
      {
        "title": "Buildroot manual",
        "url": "https://buildroot.org/downloads/manual/manual.html"
      },
      {
        "title": "U-Boot booti",
        "url": "https://docs.u-boot.org/en/latest/usage/cmd/booti.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV104",
    "group": "resume",
    "title": "你改的是 dts，跑的是另一份 dtb",
    "topic": "09 Buildroot 與開機整合",
    "scope": "resume",
    "basis": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks\n\n範圍：履歷必答／實作深挖\n\n你把status改成okay卻沒有影響。如何追蹤source dts到Buildroot產物，再到U-Boot真正傳入kernel的那一份？\n\n主管追問：\n1. 多份同名dtb如何辨識？\n2. overlay與bootloader修改是否會改變最終樹？\n3. runtime /proc/device-tree或sysfs資訊如何核對？\n4. build成功但產物未更新時，哪個timestamp或hash最有用？",
    "reference": "### 判分要點\n- 以產物hash與runtime樹追蹤，不靠檔名猜測\n- 區分source、編譯產物與最終傳入內容\n- 確認實際開機來源\n\n### 必須拿出的證據\n提供source到runtime的對照鏈與一個可辨識的測試屬性。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks"
    },
    "sources": [
      {
        "title": "Buildroot manual",
        "url": "https://buildroot.org/downloads/manual/manual.html"
      },
      {
        "title": "U-Boot booti",
        "url": "https://docs.u-boot.org/en/latest/usage/cmd/booti.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV105",
    "group": "resume",
    "title": "bootargs 改了但沒有真的生效",
    "topic": "09 Buildroot 與開機整合",
    "scope": "resume",
    "basis": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks\n\n範圍：履歷必答／實作深挖\n\n你在U-Boot改了環境變數，下一次開機卻還是舊root。請解釋可能的來源優先序與驗證方式。\n\n主管追問：\n1. default environment、持久environment與啟動script誰覆蓋誰？\n2. kernel實際command line到哪裡看？\n3. 環境變數變更是否真的持久化、需要什麼條件？\n4. 如何避免把測試機偶然留下的environment當成可重現設定？",
    "reference": "### 判分要點\n- 分清設定來源、執行時值與持久保存\n- 以kernel收到的command line驗證\n- 建置設定須能在乾淨環境重現\n\n### 必須拿出的證據\n提供實際printenv/boot script與/proc/cmdline對照。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks"
    },
    "sources": [
      {
        "title": "Buildroot manual",
        "url": "https://buildroot.org/downloads/manual/manual.html"
      },
      {
        "title": "U-Boot booti",
        "url": "https://docs.u-boot.org/en/latest/usage/cmd/booti.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV106",
    "group": "resume",
    "title": "自動開機測試看到舊 log 就過了",
    "topic": "09 Buildroot 與開機整合",
    "scope": "resume",
    "basis": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks\n\n範圍：履歷必答／實作深挖\n\n測試腳本只要grep到READY就通過。console檔案裡剛好有上一次的READY，你怎麼防止假陽性？\n\n主管追問：\n1. 每次啟動如何識別新instance與版本？\n2. console讀取、timeout與QEMU exit status怎麼共同判定？\n3. 腳本中途失敗如何清理child process與pipe？\n4. 只看到登入提示是否足以代表你的daemon可用？",
    "reference": "### 判分要點\n- 隔離每次測試產物並使用session/版本標記\n- 驗證真實功能ready\n- 程序退出與超時需形成明確結果，不可只grep歷史字串\n\n### 必須拿出的證據\n展示一次成功及至少三種可被正確判失敗的boot情境。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks"
    },
    "sources": [
      {
        "title": "Buildroot manual",
        "url": "https://buildroot.org/downloads/manual/manual.html"
      },
      {
        "title": "U-Boot booti",
        "url": "https://docs.u-boot.org/en/latest/usage/cmd/booti.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV107",
    "group": "resume",
    "title": "檔案明明存在卻說 No such file",
    "topic": "09 Buildroot 與開機整合",
    "scope": "resume",
    "basis": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks\n\n範圍：履歷必答／實作深挖\n\nARM64映像裡daemon檔案存在且有執行權限，shell卻回No such file or directory。請提出可驗證的根因。\n\n主管追問：\n1. ELF interpreter路徑是否存在？\n2. glibc、musl與不同ABI混用會怎樣？\n3. script的shebang與換行格式要怎麼檢查？\n4. static linking能解決哪些依賴，不能解決哪些架構問題？",
    "reference": "### 判分要點\n- 存在的binary仍可能缺動態載入器或不相容ABI\n- 依ELF與shebang證據診斷\n- static不是所有部署問題的萬靈丹\n\n### 必須拿出的證據\n提供file/readelf輸出、interpreter路徑與target library清單。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks"
    },
    "sources": [
      {
        "title": "Buildroot manual",
        "url": "https://buildroot.org/downloads/manual/manual.html"
      },
      {
        "title": "U-Boot booti",
        "url": "https://docs.u-boot.org/en/latest/usage/cmd/booti.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV108",
    "group": "resume",
    "title": "斷電發生在映像更新一半",
    "topic": "09 Buildroot 與開機整合",
    "scope": "role_extension",
    "basis": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks",
    "level": "職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks\n\n範圍：職務延伸／極難\n\n若把你的自訂image拿去做現場更新，寫一半斷電後如何避免完全無法開機？這題是延伸設計，不是要求你聲稱已完成。\n\n主管追問：\n1. A/B或其他方案的切換提交點在哪？\n2. boot成功與應用健康通過如何區分？\n3. 環境或metadata本身寫壞時如何選可開機版本？\n4. 版本回退、配置migration與可寫資料如何處理？",
    "reference": "### 判分要點\n- 將新映像寫入、驗證、切換及確認成功分開\n- 需要可復原metadata及回退規則\n- 先說明真實儲存/boot條件再做設計\n\n### 必須拿出的證據\n提供更新狀態機與每個持久化步驟斷電的恢復表。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "Custom Embedded Linux Image & Boot Integration：BR2_EXTERNAL、U-Boot、QEMU ARM64、read-only rootfs、boot checks"
    },
    "sources": [
      {
        "title": "Buildroot manual",
        "url": "https://buildroot.org/downloads/manual/manual.html"
      },
      {
        "title": "U-Boot booti",
        "url": "https://docs.u-boot.org/en/latest/usage/cmd/booti.html"
      },
      {
        "title": "Linux Devicetree usage model",
        "url": "https://docs.kernel.org/devicetree/usage-model.html"
      }
    ]
  },
  {
    "id": "CV109",
    "group": "resume",
    "title": "硬體相容性問題請給根因，不是結果",
    "topic": "10 實習、GPIO 與 RTL",
    "scope": "resume",
    "basis": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework\n\n範圍：履歷必答／實作深挖\n\n履歷寫resolved hardware compatibility issues。選一個真實問題，交代兩端設備、介面、症狀與你改了什麼。\n\n主管追問：\n1. 差異在電氣、接線、協議、韌體版本還是參數範圍？\n2. 哪份datasheet或量測支持你的判斷？\n3. 如何排除只是重新插拔或重開機暫時恢復？\n4. 修正有沒有對其他型號或設定造成回歸？",
    "reference": "### 判分要點\n- 不能自行假設履歷沒有寫的設備型號與協議\n- 依實際證據區分問題層次\n- 修正需有控制變因與回歸驗證\n\n### 必須拿出的證據\n提供可公開的設備/版本資訊、失敗條件與驗證紀錄。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework"
    },
    "sources": [
      {
        "title": "Linux GPIO descriptor consumer",
        "url": "https://docs.kernel.org/driver-api/gpio/consumer.html"
      }
    ]
  },
  {
    "id": "CV110",
    "group": "resume",
    "title": "夾持力與角度的單位不能猜",
    "topic": "10 實習、GPIO 與 RTL",
    "scope": "resume",
    "basis": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework\n\n範圍：履歷必答／實作深挖\n\n把gripping force與angular setting從應用輸入轉成設備命令。請說明單位、範圍、量化與保護。\n\n主管追問：\n1. degree、radian、encoder count的轉換在哪一層？\n2. 超範圍是拒絕、截斷還是飽和，為何？\n3. 設備回報值與實際力/角度是否一樣？\n4. 如何驗證正負方向、零點與機構限制？",
    "reference": "### 判分要點\n- 單位與物理意義需來自真實設備規格\n- 設定值、感測值與實際效果分開\n- 範圍及精度要有明確契約\n\n### 必須拿出的證據\n提供實際轉換公式、合法範圍與可安全重現的邊界測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework"
    },
    "sources": [
      {
        "title": "Linux GPIO descriptor consumer",
        "url": "https://docs.kernel.org/driver-api/gpio/consumer.html"
      }
    ]
  },
  {
    "id": "CV111",
    "group": "resume",
    "title": "夾爪命令 timeout 後能重送嗎",
    "topic": "10 實習、GPIO 與 RTL",
    "scope": "resume",
    "basis": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework\n\n範圍：履歷必答／實作深挖\n\n你送出關閉夾爪命令後沒有收到回應。設備可能已執行，也可能沒收到。你怎麼決定下一步？\n\n主管追問：\n1. 命令是設定絕對目標，還是相對移動？\n2. 有沒有序號、狀態讀回或idempotent語意？\n3. 重試是否可能多轉一次或過度施力？\n4. 通訊恢復後，軟體狀態如何與實際設備重新對齊？",
    "reference": "### 判分要點\n- timeout是結果未知，不等於未執行\n- 依實際命令語意選擇重試與狀態確認\n- 不得假設所有動作可安全重送\n\n### 必須拿出的證據\n畫出命令已執行但回應遺失的時序與恢復策略。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework"
    },
    "sources": [
      {
        "title": "Linux GPIO descriptor consumer",
        "url": "https://docs.kernel.org/driver-api/gpio/consumer.html"
      }
    ]
  },
  {
    "id": "CV112",
    "group": "resume",
    "title": "你如何證明相容性真的修好了",
    "topic": "10 實習、GPIO 與 RTL",
    "scope": "resume",
    "basis": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework\n\n範圍：履歷必答／實作深挖\n\n只做一次成功夾取不構成完整驗證。請設計能分離通訊、設定與機構行為的測試。\n\n主管追問：\n1. 哪些變因要固定，哪些範圍要掃描？\n2. 長時間重複操作如何觀察timeout與錯誤累積？\n3. 問題只在特定角度/力/啟動順序出現時怎麼縮減？\n4. 現場無法公開全部資料時，面試要如何提供足夠證據？",
    "reference": "### 判分要點\n- 將驗證分層並控制變因\n- 測試含啟動、正常、故障與恢復\n- 證據可去識別化但不能只剩口號\n\n### 必須拿出的證據\n提供測試矩陣、成功判準與一份可公開的結果摘要。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework"
    },
    "sources": [
      {
        "title": "Linux GPIO descriptor consumer",
        "url": "https://docs.kernel.org/driver-api/gpio/consumer.html"
      }
    ]
  },
  {
    "id": "CV113",
    "group": "resume",
    "title": "GPIO 的 1 不一定是實體高電位",
    "topic": "10 實習、GPIO 與 RTL",
    "scope": "resume",
    "basis": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework\n\n範圍：履歷必答／實作深挖\n\n用GPIO控制LED時，你在程式寫1但燈沒有亮。請從邏輯值、active-low、pinmux到電路逐層說明。\n\n主管追問：\n1. GPIO descriptor的logical值與raw電位如何區分？\n2. 腳位是否真的切成GPIO，方向與權限由誰設定？\n3. open-drain、pull-up與外部負載可能造成什麼觀察？\n4. 你使用的是userspace介面還是kernel driver，依據哪個版本？",
    "reference": "### 判分要點\n- 邏輯極性、pinmux與電氣條件分開\n- 不能只靠軟體讀回推論外部電路\n- 說明實際API與平台限制\n\n### 必須拿出的證據\n提供實際接線/設定與可辨識的量測或log。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework"
    },
    "sources": [
      {
        "title": "Linux GPIO descriptor consumer",
        "url": "https://docs.kernel.org/driver-api/gpio/consumer.html"
      }
    ]
  },
  {
    "id": "CV114",
    "group": "resume",
    "title": "七段顯示器的閃爍從哪裡來",
    "topic": "10 實習、GPIO 與 RTL",
    "scope": "resume",
    "basis": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework\n\n範圍：履歷必答／實作深挖\n\n你做的七段顯示器若採multiplex掃描，負載增加後開始閃爍。請分析從排程到位元對應的問題。\n\n主管追問：\n1. common-anode/common-cathode會如何改變輸出極性？\n2. 掃描頻率、duty cycle與亮度如何取捨？\n3. Linux userspace sleep能提供什麼時間精度，不能保證什麼？\n4. 更新多個segment時怎麼避免短暫錯誤圖樣？",
    "reference": "### 判分要點\n- 先交代實際是否採multiplex\n- 軟體時間與硬體需求分開\n- 位元映射、極性及更新順序要可驗證\n\n### 必須拿出的證據\n提供一個顯示數字的bit pattern與負載下的時序觀察。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework"
    },
    "sources": [
      {
        "title": "Linux GPIO descriptor consumer",
        "url": "https://docs.kernel.org/driver-api/gpio/consumer.html"
      }
    ]
  },
  {
    "id": "CV115",
    "group": "resume",
    "title": "你修改 kernel 的哪一段",
    "topic": "10 實習、GPIO 與 RTL",
    "scope": "resume",
    "basis": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework\n\n範圍：履歷必答／實作深挖\n\n履歷說modified Raspberry Pi OS kernel。指出真正改動的檔案與功能，不能把成功編譯kernel等同於改過核心邏輯。\n\n主管追問：\n1. 是設定、Device Tree、driver、patch還是新的功能？\n2. 版本、config與modules是否和執行中的kernel一致？\n3. 如何確認裝置真的正在跑你的產物？\n4. 失敗時如何保留可復原的開機路徑？",
    "reference": "### 判分要點\n- 準確描述課程工作與個人修改範圍\n- 建置、部署與執行版本需對得上\n- 用可觀察差異證明改動生效\n\n### 必須拿出的證據\n提供實際diff、uname/版本識別與功能驗證。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework"
    },
    "sources": [
      {
        "title": "Linux GPIO descriptor consumer",
        "url": "https://docs.kernel.org/driver-api/gpio/consumer.html"
      }
    ]
  },
  {
    "id": "CV116",
    "group": "resume",
    "title": "scoreboard 要擋哪一種 hazard",
    "topic": "10 實習、GPIO 與 RTL",
    "scope": "resume",
    "basis": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework\n\n範圍：履歷必答／實作深挖\n\n在你的課程框架裡，用一段具RAW、WAR、WAW依賴的指令序列，逐cycle說明scoreboard決策。\n\n主管追問：\n1. issue、operand read與writeback各檢查什麼？\n2. 哪些hazard因框架限制不可能出現？\n3. structural hazard與data hazard如何分開？\n4. 同cycle完成與發射的優先規則怎麼定義？",
    "reference": "### 判分要點\n- 先說明實際pipeline與ISA假設\n- 用寄存器讀寫集合與資源狀態解釋\n- 不能背四個階段卻畫不出時序\n\n### 必須拿出的證據\n提供RTL狀態表、測試指令與逐cycle波形。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework"
    },
    "sources": [
      {
        "title": "Linux GPIO descriptor consumer",
        "url": "https://docs.kernel.org/driver-api/gpio/consumer.html"
      }
    ]
  },
  {
    "id": "CV117",
    "group": "resume",
    "title": "完成順序跟發出順序不同",
    "topic": "10 實習、GPIO 與 RTL",
    "scope": "resume",
    "basis": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework\n\n範圍：履歷必答／實作深挖\n\n兩個不同延遲的操作先後發出，後發先完成。你的scoreboard怎麼知道哪個destination可以更新？\n\n主管追問：\n1. tag或功能單元identity如何對應到正確操作？\n2. WAW與WAR何時阻擋完成或寫回？\n3. flush/reset後舊completion還到達，如何丟棄？\n4. 這和SSD重用CID的問題有哪些相似與不同？",
    "reference": "### 判分要點\n- 區分依賴控制、結果識別與取消後失效\n- 需根據實際框架說明完成契約\n- 類比不能忽略CPU與I/O協議差異\n\n### 必須拿出的證據\n畫出兩個變延遲操作及一個reset交錯的狀態。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework"
    },
    "sources": [
      {
        "title": "Linux GPIO descriptor consumer",
        "url": "https://docs.kernel.org/driver-api/gpio/consumer.html"
      }
    ]
  },
  {
    "id": "CV118",
    "group": "resume",
    "title": "nonblocking assignment 的舊值陷阱",
    "topic": "10 實習、GPIO 與 RTL",
    "scope": "resume",
    "basis": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework\n\n範圍：履歷必答／實作深挖\n\n同一個clocked always block內先更新busy再用busy判斷發射。你看到的是新值還是舊值？\n\n主管追問：\n1. blocking與nonblocking的排程語意怎麼影響這段RTL？\n2. next-state與state分離如何提高可檢查性？\n3. 組合邏輯漏掉賦值會推導什麼儲存行為？\n4. reset與同cycle多個事件的優先序如何測？",
    "reference": "### 判分要點\n- 依Verilog事件排程分析，而非照程式文字先後猜\n- 明確預設next-state與優先序\n- 綜合結果要與預期硬體一致\n\n### 必須拿出的證據\n提供最小RTL片段、波形及reset/同cycle事件測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework"
    },
    "sources": [
      {
        "title": "Linux GPIO descriptor consumer",
        "url": "https://docs.kernel.org/driver-api/gpio/consumer.html"
      }
    ]
  },
  {
    "id": "CV119",
    "group": "resume",
    "title": "模擬波形漂亮，assertion在哪",
    "topic": "10 實習、GPIO 與 RTL",
    "scope": "resume",
    "basis": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework\n\n範圍：履歷必答／實作深挖\n\n課程testbench通過，但你的scoreboard可能永遠stall而不做錯誤寫回。請補上會抓到無進度的驗證。\n\n主管追問：\n1. 安全性與活性性質要如何分開？\n2. 哪些資源最終一定釋放，依賴什麼公平性假設？\n3. 如何核對每筆accepted操作剛好完成一次？\n4. 隨機指令的reference model如何避免複製同一個錯誤？",
    "reference": "### 判分要點\n- 不出錯不等於有進度\n- 完成次數、tag匹配與有界等待需驗證\n- 明確列出外部單元回應的假設\n\n### 必須拿出的證據\n提出三個assertion及一個會卡死但不寫錯值的反例。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework"
    },
    "sources": [
      {
        "title": "Linux GPIO descriptor consumer",
        "url": "https://docs.kernel.org/driver-api/gpio/consumer.html"
      }
    ]
  },
  {
    "id": "CV120",
    "group": "resume",
    "title": "跨專案能力到底可轉移什麼",
    "topic": "10 實習、GPIO 與 RTL",
    "scope": "resume",
    "basis": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework",
    "level": "履歷必答／實作深挖",
    "mode": "self",
    "body": "履歷依據：ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework\n\n範圍：履歷必答／實作深挖\n\n把夾爪整合、Linux服務、FIFO driver與scoreboard各選一個失敗情境，說明你能轉移到SSD韌體的分析方法。\n\n主管追問：\n1. 哪個共通點是ownership，哪個是有限資源或狀態機？\n2. 哪些Linux API細節不能直接搬到裸機controller？\n3. 你缺的儲存領域知識如何在不假裝熟悉的情況下補上？\n4. 我指定一個你沒做過的模組，你會先要哪三份資料？",
    "reference": "### 判分要點\n- 以可驗證的問題分析方法建立關聯\n- 坦白區分既有能力與新領域\n- 先確認平台、協議與故障模型\n\n### 必須拿出的證據\n每項給一個真實例子，再提出一份具體的SSD模組學習/驗證計畫。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "ITRI gripper integration；Raspberry Pi GPIO/kernel labs；Verilog scoreboard in supplied framework"
    },
    "sources": [
      {
        "title": "Linux GPIO descriptor consumer",
        "url": "https://docs.kernel.org/driver-api/gpio/consumer.html"
      }
    ]
  },
  {
    "id": "CV121",
    "group": "resume",
    "title": "先說清楚你站在 host 還是 controller",
    "topic": "11 PCIe NVMe 與 DMA",
    "scope": "role_extension",
    "basis": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller\n\n範圍：PCIe SSD 職務延伸／極難\n\n畫出application、Linux block/NVMe host driver、PCIe、SSD controller firmware、FTL與NAND。把你已有經驗的位置標出來。\n\n主管追問：\n1. 一次read在各層的資料、控制與完成通知如何走？\n2. 哪一層能呼叫Linux DMA API，哪一層不能照搬？\n3. PCIe、NVMe與NAND各自定義哪種介面？\n4. 你若被分到device firmware，最先缺的三項平台資訊是什麼？",
    "reference": "### 判分要點\n- 區分host軟體與device firmware責任\n- NVMe命令、PCIe傳輸與NAND媒體不是同層\n- 已有Linux經驗可轉移但不能冒充SSD實作\n\n### 必須拿出的證據\n提供端到端圖與自己已驗證/待學範圍。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller"
    },
    "sources": [
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      },
      {
        "title": "Linux DMA mapping guide",
        "url": "https://docs.kernel.org/core-api/dma-api-howto.html"
      },
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV122",
    "group": "resume",
    "title": "SQ 和 CQ 不是一個普通 queue 就結束",
    "topic": "11 PCIe NVMe 與 DMA",
    "scope": "role_extension",
    "basis": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller\n\n範圍：PCIe SSD 職務延伸／極難\n\n從controller端讀host SQ、執行命令並寫回CQ，說明兩個ring的producer、consumer與各自索引。\n\n主管追問：\n1. SQ entry被consume是否等於命令已完成？\n2. CQ滿時controller可以覆蓋未被host消費的entry嗎？\n3. doorbell告知的是哪個方向的進度？\n4. head/tail與phase的初值、wrap規則要依哪份版本規格？",
    "reference": "### 判分要點\n- submission消費與命令完成分開\n- 兩個queue有不同擁有者與流控\n- phase用來識別新completion，需依明確規格而非教學模型猜測\n\n### 必須拿出的證據\n畫出小depth下submit、consume、complete及CQ回收的逐步狀態。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller"
    },
    "sources": [
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      },
      {
        "title": "Linux DMA mapping guide",
        "url": "https://docs.kernel.org/core-api/dma-api-howto.html"
      },
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV123",
    "group": "resume",
    "title": "三種 address 不可以都叫 pointer",
    "topic": "11 PCIe NVMe 與 DMA",
    "scope": "role_extension",
    "basis": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller\n\n範圍：PCIe SSD 職務延伸／極難\n\nLinux host取得一個buffer指標，準備交給PCIe device DMA。請區分CPU virtual、CPU physical與DMA/bus address。\n\n主管追問：\n1. IOMMU存在時，哪個位址會不同？\n2. dma_map_sg回傳的entry數為何可能少於原始數？\n3. 同步、unmap與buffer有效期由誰負責？\n4. controller接到PRP/SGL地址後，為何不能當本地C pointer解參照？",
    "reference": "### 判分要點\n- 依DMA API處理映射與生命週期，不把一般CPU pointer交給裝置\n- 映射後SG形狀可能改變\n- host與device地址空間不同\n\n### 必須拿出的證據\n提供host映射/提交/完成/解除映射的時序與錯誤處理。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller"
    },
    "sources": [
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      },
      {
        "title": "Linux DMA mapping guide",
        "url": "https://docs.kernel.org/core-api/dma-api-howto.html"
      },
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV124",
    "group": "resume",
    "title": "coherent 不代表不用 ordering",
    "topic": "11 PCIe NVMe 與 DMA",
    "scope": "role_extension",
    "basis": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller\n\n範圍：PCIe SSD 職務延伸／極難\n\nhost先寫descriptor再敲doorbell，或device先寫CQ內容再公開有效狀態。哪些順序需要平台保證？\n\n主管追問：\n1. CPU compiler barrier、memory barrier、DMA ordering與MMIO accessor差在哪？\n2. cache coherent能保證什麼，不能自動保證什麼？\n3. consumer看到phase更新後，如何確保其他欄位的觀察符合協議？\n4. 為什麼不能只把struct成員都加volatile？",
    "reference": "### 判分要點\n- 可見性、順序與所有權分開\n- 依host/device架構和I/O API選同步\n- C volatile與一般atomic不自動涵蓋所有裝置存取需求\n\n### 必須拿出的證據\n畫出錯誤發布順序的反例，註明每個barrier對應的觀察者。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller"
    },
    "sources": [
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      },
      {
        "title": "Linux DMA mapping guide",
        "url": "https://docs.kernel.org/core-api/dma-api-howto.html"
      },
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV125",
    "group": "resume",
    "title": "PRP/SGL 描述的是誰的記憶體",
    "topic": "11 PCIe NVMe 與 DMA",
    "scope": "role_extension",
    "basis": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller\n\n範圍：PCIe SSD 職務延伸／極難\n\n一筆I/O跨越多個host頁面且第一個byte未page-align。請說明PRP或SGL如何描述它，先宣告使用的規格版本與支援能力。\n\n主管追問：\n1. 第一段剩餘長度怎麼算，後續頁面有何對齊要求？\n2. CPU虛擬連續能不能推論DMA實體連續？\n3. 長度與地址加法溢位如何驗證？\n4. 何時需要list，list本身由誰配置、映射與保留？",
    "reference": "### 判分要點\n- 依協議版本與裝置能力解讀資料描述\n- 虛擬連續不等於DMA連續\n- 資料與描述表皆需有界且活到硬體不再使用\n\n### 必須拿出的證據\n用跨兩頁與多頁的例子，列出地址、長度及所有權。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller"
    },
    "sources": [
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      },
      {
        "title": "Linux DMA mapping guide",
        "url": "https://docs.kernel.org/core-api/dma-api-howto.html"
      },
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV126",
    "group": "resume",
    "title": "有 interrupt 卻沒有新 completion",
    "topic": "11 PCIe NVMe 與 DMA",
    "scope": "role_extension",
    "basis": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller\n\n範圍：PCIe SSD 職務延伸／極難\n\nISR收到通知，讀CQ卻看不到新phase；另一種情況是CQ已有資料卻沒有新的interrupt。請分層分析。\n\n主管追問：\n1. interrupt coalescing、共享狀態與ordering各可能影響什麼？\n2. 輪詢/中斷模式切換如何避免漏掉工作？\n3. 清除通知、檢查queue與重新啟用中斷的順序如何定義？\n4. 哪些步驟依裝置及平台規格，不能只靠通用模板？",
    "reference": "### 判分要點\n- 通知與queue真實狀態不是同一物件\n- 分析level/edge及屏蔽/重啟協議\n- 避免任意假設interrupt與一筆completion一一對應\n\n### 必須拿出的證據\n給出至少兩條可區分的時序與需要的trace欄位。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller"
    },
    "sources": [
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      },
      {
        "title": "Linux DMA mapping guide",
        "url": "https://docs.kernel.org/core-api/dma-api-howto.html"
      },
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV127",
    "group": "resume",
    "title": "CID 重用後的舊 completion",
    "topic": "11 PCIe NVMe 與 DMA",
    "scope": "role_extension",
    "basis": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller\n\n範圍：PCIe SSD 職務延伸／極難\n\nCID=7的請求timeout後被重用，舊completion晚到。只靠CID查表會把哪個請求完成？\n\n主管追問：\n1. CID是否要連同queue identity一起看？\n2. 軟體generation若不在硬體completion裡，能否單獨識別舊結果？\n3. reset/quiesce需要提供什麼保證才能安全重用？\n4. unknown CID、duplicate與late completion各如何記錄及處理？",
    "reference": "### 判分要點\n- 識別範圍、重用與硬體協議需一併分析\n- 不能宣稱本地generation自動存在於wire CQE\n- 只有建立適當停止/隔離保證後才可回收重用\n\n### 必須拿出的證據\n畫出舊新請求同CID的時序，指出真正能拒絕舊結果的資訊來源。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller"
    },
    "sources": [
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      },
      {
        "title": "Linux DMA mapping guide",
        "url": "https://docs.kernel.org/core-api/dma-api-howto.html"
      },
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV128",
    "group": "resume",
    "title": "先發出的 write 不一定先完成",
    "topic": "11 PCIe NVMe 與 DMA",
    "scope": "role_extension",
    "basis": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller\n\n範圍：PCIe SSD 職務延伸／極難\n\n兩筆I/O先後提交、後者先完成。你要如何判斷這是合法並行，還是違反資料依賴？\n\n主管追問：\n1. SQ順序、執行順序與完成順序是否相同？\n2. 重疊LBA、flush/FUA及跨queue關係各需哪些規格依據？\n3. 上層把completion視為持久化承諾時需要什麼前提？\n4. 為了簡化把全部串行化，會犧牲什麼？",
    "reference": "### 判分要點\n- 依命令與順序/持久化契約判斷，不以文字提交次序推論全部保證\n- 區分獨立I/O與有依賴操作\n- 先確認規格版本及feature\n\n### 必須拿出的證據\n畫出一組獨立與一組有依賴的I/O，標出需要的保證。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller"
    },
    "sources": [
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      },
      {
        "title": "Linux DMA mapping guide",
        "url": "https://docs.kernel.org/core-api/dma-api-howto.html"
      },
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV129",
    "group": "resume",
    "title": "timeout 不是命令已停止",
    "topic": "11 PCIe NVMe 與 DMA",
    "scope": "role_extension",
    "basis": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller\n\n範圍：PCIe SSD 職務延伸／極難\n\nhost timeout後送Abort並想立刻free DMA buffer。請指出這個生命週期推論缺少哪些保證。\n\n主管追問：\n1. Abort完成是否等於原命令所有存取都已停止？\n2. 原命令正常completion與Abort競爭時，誰回報一次性結果？\n3. 何時需要更強的controller reset或隔離？\n4. 寫入結果未知時，重試是否安全？",
    "reference": "### 判分要點\n- 依具體協議判斷Abort與原命令狀態\n- timeout不表示硬體已失去存取權\n- 直到證明不再DMA前保留映射與buffer，交付結果需一次性管理\n\n### 必須拿出的證據\n提供timeout/正常完成/Abort/reset的競爭狀態圖。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller"
    },
    "sources": [
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      },
      {
        "title": "Linux DMA mapping guide",
        "url": "https://docs.kernel.org/core-api/dma-api-howto.html"
      },
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV130",
    "group": "resume",
    "title": "reset 清零 head 就好？",
    "topic": "11 PCIe NVMe 與 DMA",
    "scope": "role_extension",
    "basis": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller\n\n範圍：PCIe SSD 職務延伸／極難\n\ncontroller異常後，你打算把所有software indices歸零再重新開始。請指出硬體、host與資源還缺哪些步驟。\n\n主管追問：\n1. 先停止新submit，再如何處理in-flight DMA與interrupt？\n2. queue記憶體何時可以unmap或重用？\n3. phase、doorbell與outstanding表如何一致重建？\n4. 舊generation的工作與新queue identity如何隔離？",
    "reference": "### 判分要點\n- reset是跨層生命週期協議，不只是software清零\n- 依硬體停止保證安排同步、回收及重建\n- 保留所有未完成請求的終止狀態\n\n### 必須拿出的證據\n畫出reset各階段前後條件與失敗時的保守處理。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller"
    },
    "sources": [
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      },
      {
        "title": "Linux DMA mapping guide",
        "url": "https://docs.kernel.org/core-api/dma-api-howto.html"
      },
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV131",
    "group": "resume",
    "title": "NLB=0 到底讀幾個 block",
    "topic": "11 PCIe NVMe 與 DMA",
    "scope": "role_extension",
    "basis": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller\n\n範圍：PCIe SSD 職務延伸／極難\n\n收到SLBA、NLB與namespace大小後，請設計不會overflow或越界的範圍驗證。假設這裡使用NVMe NVM Read/Write的zero-based NLB。\n\n主管追問：\n1. NLB=0與0xFFFF各代表幾個block？\n2. 為什麼先做16-bit加一可能得到錯誤結果？\n3. namespace block count與最後有效LBA差在哪？\n4. 轉成byte offset、length與exclusive end時，各在哪裡檢查？",
    "reference": "### 判分要點\n- 先升寬再加一，分別得到1與65536\n- 用減法驗範圍避免先加法溢位\n- LBA格式與byte換算依已解碼的namespace資訊\n\n### 必須拿出的證據\n給出namespace最後一塊、跨界及64-bit換算上限的測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller"
    },
    "sources": [
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      },
      {
        "title": "Linux DMA mapping guide",
        "url": "https://docs.kernel.org/core-api/dma-api-howto.html"
      },
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV132",
    "group": "resume",
    "title": "queue depth 加倍，p99 變爛",
    "topic": "11 PCIe NVMe 與 DMA",
    "scope": "role_extension",
    "basis": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller\n\n範圍：PCIe SSD 職務延伸／極難\n\n測試發現queue depth加倍後IOPS上升，但p99延遲與timeout變多。身為開發者你如何分析而非直接把depth調回去？\n\n主管追問：\n1. 用Little法則時，哪些穩定性與量測範圍假設必須成立？\n2. 排隊時間、裝置服務時間與完成處理時間如何分離？\n3. GC、read retry、interrupt coalescing各會留下什麼跡象？\n4. 如何控制負載與填滿程度，避免比較不同狀態的SSD？",
    "reference": "### 判分要點\n- 吞吐與尾延遲需共同評估\n- 分層量測並固定工作負載、裝置狀態與時間窗\n- 穩態公式不能任意套在非穩態尖峰\n\n### 必須拿出的證據\n提出具體指標、對照實驗與支持/反駁各假說的觀察。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "由 Linux service / FIFO / ring buffer 延伸到應徵 PCIe SSD 部門；履歷未主張已實作 NVMe controller"
    },
    "sources": [
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      },
      {
        "title": "Linux DMA mapping guide",
        "url": "https://docs.kernel.org/core-api/dma-api-howto.html"
      },
      {
        "title": "Linux memory barriers",
        "url": "https://docs.kernel.org/core-api/wrappers/memory-barriers.html"
      }
    ]
  },
  {
    "id": "CV133",
    "group": "resume",
    "title": "一 TiB 的 mapping table 多大",
    "topic": "12 FTL 斷電與綜合故障",
    "scope": "role_extension",
    "basis": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案\n\n範圍：PCIe SSD 職務延伸／極難\n\n假設1 TiB邏輯容量、4 KiB mapping granularity、每entry 4 bytes。先算純mapping表，再說為什麼實際DRAM預算不只這個數字。\n\n主管追問：\n1. entry數與純表大小各是多少？\n2. 有效性、版本、反向mapping與metadata需要什麼？\n3. 若DRAM放不下，你如何設計分層或cache？\n4. mapping cache miss會怎樣影響讀延遲與斷電恢復？",
    "reference": "### 判分要點\n- entry數為2^28，純表為2^30 bytes即1 GiB\n- 額外狀態與buffer另計\n- 縮減DRAM會引入metadata I/O與一致性取捨\n\n### 必須拿出的證據\n給出明確單位的容量公式與兩種mapping設計比較。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案"
    },
    "sources": [
      {
        "title": "NVM Command Set 1.0d, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-NVM-Command-Set-Specification-1.0d-2023.12.28-Ratified.pdf"
      },
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      }
    ]
  },
  {
    "id": "CV134",
    "group": "resume",
    "title": "舊資料什麼時候才可以失效",
    "topic": "12 FTL 斷電與綜合故障",
    "scope": "role_extension",
    "basis": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案\n\n範圍：PCIe SSD 職務延伸／極難\n\n更新一個LBA時，需要寫新data並修改mapping。請定義可從任何斷電點恢復的順序，不准只說加CRC。\n\n主管追問：\n1. 新data寫完與確實持久化是否同一件事？\n2. mapping提交前，舊data可否已被GC回收？\n3. torn metadata record如何辨識，版本如何選？\n4. ack給host的時點依哪種持久化契約決定？",
    "reference": "### 判分要點\n- 先建立data與mapping的持久化/提交協議\n- 舊版本保留到新版本可恢復\n- CRC、版本與順序各解決不同問題，不能互相替代\n\n### 必須拿出的證據\n列出每個持久化步驟與斷電後應選舊或新版本的表。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案"
    },
    "sources": [
      {
        "title": "NVM Command Set 1.0d, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-NVM-Command-Set-Specification-1.0d-2023.12.28-Ratified.pdf"
      },
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      }
    ]
  },
  {
    "id": "CV135",
    "group": "resume",
    "title": "GC 需要空間，空間卻已經滿了",
    "topic": "12 FTL 斷電與綜合故障",
    "scope": "role_extension",
    "basis": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案\n\n範圍：PCIe SSD 職務延伸／極難\n\nSSD可用free pages逼近零，GC搬移有效資料本身也需要空間。你如何避免進入無法回收的死局？\n\n主管追問：\n1. 要保留什麼reserve與最壞搬移預算？\n2. victim選擇只看invalid比例會漏掉什麼？\n3. 前景write與背景GC如何分配資源？\n4. host持續寫入時，何時需要節流或拒絕？",
    "reference": "### 判分要點\n- 回收需要預留可用目的空間及進度保證\n- GC與前景I/O互相依賴\n- 資源控制要在完全耗盡之前觸發\n\n### 必須拿出的證據\n提出free-space不變數與接近滿盤時的壓力測試。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案"
    },
    "sources": [
      {
        "title": "NVM Command Set 1.0d, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-NVM-Command-Set-Specification-1.0d-2023.12.28-Ratified.pdf"
      },
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      }
    ]
  },
  {
    "id": "CV136",
    "group": "resume",
    "title": "write amplification 的分母要一致",
    "topic": "12 FTL 斷電與綜合故障",
    "scope": "role_extension",
    "basis": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案\n\n範圍：PCIe SSD 職務延伸／極難\n\nhost寫入100 GiB，媒體program總量150 GiB。先算WAF，再說這個數字可能在哪裡被錯算。\n\n主管追問：\n1. metadata、GC搬移與cache folding是否計入同一定義？\n2. 相同bytes在不同層重複計數會造成什麼偏差？\n3. warm-up、穩態、填滿程度與TRIM會如何影響比較？\n4. WAF下降是否一定代表latency或壽命整體改善？",
    "reference": "### 判分要點\n- 在明確計數定義下WAF=1.5\n- 固定分子分母、時間窗與裝置狀態\n- 其他效能/耐久指標需另外量測\n\n### 必須拿出的證據\n提供可核對的host/media counters與公平比較實驗。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案"
    },
    "sources": [
      {
        "title": "NVM Command Set 1.0d, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-NVM-Command-Set-Specification-1.0d-2023.12.28-Ratified.pdf"
      },
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      }
    ]
  },
  {
    "id": "CV137",
    "group": "resume",
    "title": "wear leveling 不是 GC 的另一個名字",
    "topic": "12 FTL 斷電與綜合故障",
    "scope": "role_extension",
    "basis": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案\n\n範圍：PCIe SSD 職務延伸／極難\n\n某些block很少擦除、某些block已高度磨耗。你怎麼區分GC策略與wear-leveling目標？\n\n主管追問：\n1. dynamic與static wear leveling解決什麼差異？\n2. 搬動冷資料會增加哪些寫入成本？\n3. hot/cold混放如何影響GC效率？\n4. 只有平均erase count能否發現極端磨耗分布？",
    "reference": "### 判分要點\n- GC回收空間，wear leveling控制磨耗分布，兩者互動但目標不同\n- 量測分布、成本與資料溫度分類效果\n\n### 必須拿出的證據\n提出erase-count分布、遷移成本與一個冷熱混合工作負載。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案"
    },
    "sources": [
      {
        "title": "NVM Command Set 1.0d, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-NVM-Command-Set-Specification-1.0d-2023.12.28-Ratified.pdf"
      },
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      }
    ]
  },
  {
    "id": "CV138",
    "group": "resume",
    "title": "NAND 不是可隨便覆寫的 RAM",
    "topic": "12 FTL 斷電與綜合故障",
    "scope": "role_extension",
    "basis": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案\n\n範圍：PCIe SSD 職務延伸／極難\n\n為什麼host覆寫4 KiB不能總是直接原地改同一個NAND位置？請先列出媒體模型與限制來源。\n\n主管追問：\n1. program page與erase block的粒度差異造成什麼？\n2. program順序、partial program次數與狀態轉換由誰規定？\n3. 壞塊與ECC狀態如何影響配置位置？\n4. 不同NAND型號的限制能否靠一般C知識推論？",
    "reference": "### 判分要點\n- 依具體NAND資料手冊建立program/erase與順序限制\n- FTL處理邏輯覆寫與實體配置差異\n- 不可把通用印象當所有媒體保證\n\n### 必須拿出的證據\n畫出一次out-of-place update，標明哪些條件需向vendor規格確認。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案"
    },
    "sources": [
      {
        "title": "NVM Command Set 1.0d, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-NVM-Command-Set-Specification-1.0d-2023.12.28-Ratified.pdf"
      },
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      }
    ]
  },
  {
    "id": "CV139",
    "group": "resume",
    "title": "write completion 等於斷電不丟？",
    "topic": "12 FTL 斷電與綜合故障",
    "scope": "role_extension",
    "basis": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案\n\n範圍：PCIe SSD 職務延伸／極難\n\nhost收到write completion後立即斷電，資料卻遺失。請先問對問題，再判斷是否違反承諾。\n\n主管追問：\n1. volatile write cache、FUA、Flush與PLP各改變什麼保證？\n2. data與metadata是否都在承諾範圍內？\n3. 不同queue與命令的順序能否自行假設？\n4. 沒有確認規格版本與feature，就能直接斷言firmware錯嗎？",
    "reference": "### 判分要點\n- 先確認命令、cache/feature、持久化與ordering契約\n- 傳輸完成、cache接受與非揮發提交分開\n- 依明確條件決定是否資料遺失違約\n\n### 必須拿出的證據\n提出帶FUA/Flush與不帶的對照斷電測試及預期結果集合。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案"
    },
    "sources": [
      {
        "title": "NVM Command Set 1.0d, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-NVM-Command-Set-Specification-1.0d-2023.12.28-Ratified.pdf"
      },
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      }
    ]
  },
  {
    "id": "CV140",
    "group": "resume",
    "title": "journal replay 不能把未提交資料復活",
    "topic": "12 FTL 斷電與綜合故障",
    "scope": "role_extension",
    "basis": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案\n\n範圍：PCIe SSD 職務延伸／極難\n\n開機恢復看到兩份同LBA的metadata，一份版本較新但最後寫入可能被撕裂。如何選擇並保證可重跑恢復？\n\n主管追問：\n1. 有效record、提交標記、版本與checksum各扮演什麼角色？\n2. 版本counter wrap或相同版本怎麼處理？\n3. replay執行到一半又斷電，下一次是否得到相同結果？\n4. 哪些舊record與data到何時才可清除？",
    "reference": "### 判分要點\n- 可驗證record與提交協議共同決定恢復\n- replay要具冪等或明確重入策略\n- 不能只看最大數字就選資料\n\n### 必須拿出的證據\n提供至少四個斷電切點與兩次連續恢復的結果。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案"
    },
    "sources": [
      {
        "title": "NVM Command Set 1.0d, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-NVM-Command-Set-Specification-1.0d-2023.12.28-Ratified.pdf"
      },
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      }
    ]
  },
  {
    "id": "CV141",
    "group": "resume",
    "title": "ECC、bad block、read retry 各管哪一層",
    "topic": "12 FTL 斷電與綜合故障",
    "scope": "role_extension",
    "basis": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案\n\n範圍：PCIe SSD 職務延伸／極難\n\n某頁讀不出來，工程師直接把整個block標壞。你會先確認哪些資訊？\n\n主管追問：\n1. ECC可修正、不可修正與retry狀態怎麼分？\n2. read retry的成功成本如何反映到尾延遲？\n3. 退休block前如何處理仍有效且可恢復的資料？\n4. factory bad與runtime bad的來源及持久化紀錄有何不同？",
    "reference": "### 判分要點\n- 區分錯誤更正、讀取恢復與媒體管理\n- 避免無證據直接退休\n- 資料可恢復性、可靠性及延遲成本需共同考量\n\n### 必須拿出的證據\n提出分層錯誤紀錄與read-failure注入後的處理流程。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案"
    },
    "sources": [
      {
        "title": "NVM Command Set 1.0d, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-NVM-Command-Set-Specification-1.0d-2023.12.28-Ratified.pdf"
      },
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      }
    ]
  },
  {
    "id": "CV142",
    "group": "resume",
    "title": "TRIM 之後讀到零就算正確嗎",
    "topic": "12 FTL 斷電與綜合故障",
    "scope": "role_extension",
    "basis": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案\n\n範圍：PCIe SSD 職務延伸／極難\n\nhost發deallocate後再讀相同LBA。你不能直接回答一定是零，請說明需要哪些裝置與命令條件。\n\n主管追問：\n1. 支援能力、deallocated read行為與錯誤設定要查哪裡？\n2. 邏輯deallocation與實體erase是同一時間發生嗎？\n3. GC如何避免把已失效mapping又搬回有效？\n4. TRIM與同LBA write競爭時，順序契約如何確認？",
    "reference": "### 判分要點\n- 依namespace/command/feature確認讀取結果，不概括所有裝置\n- 邏輯失效與媒體擦除分開\n- 並行更新及恢復要保留一致性\n\n### 必須拿出的證據\n提供按裝置宣告能力建立的測試，而非硬編碼期望全零。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案"
    },
    "sources": [
      {
        "title": "NVM Command Set 1.0d, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-NVM-Command-Set-Specification-1.0d-2023.12.28-Ratified.pdf"
      },
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      }
    ]
  },
  {
    "id": "CV143",
    "group": "resume",
    "title": "平均很好，p999 爆炸",
    "topic": "12 FTL 斷電與綜合故障",
    "scope": "role_extension",
    "basis": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案\n\n範圍：PCIe SSD 職務延伸／極難\n\nSSD平均latency正常，但每隔幾十秒出現極端尾延遲。請用最多六個新增指標設計診斷。\n\n主管追問：\n1. GC、read retry、熱節流、host排程各留下什麼訊號？\n2. event timestamp的時鐘來源是否可跨層對齊？\n3. outlier trace如何保留而不記錄全部I/O？\n4. 如何避免把量測工具的阻塞誤認成裝置latency？",
    "reference": "### 判分要點\n- 分層事件、queue等待與服務時間需能關聯\n- 限定低成本指標與outlier捕捉\n- 以對照實驗支持因果而非只看相關\n\n### 必須拿出的證據\n提出六個指標、三個競爭假說與各自可推翻的觀察。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案"
    },
    "sources": [
      {
        "title": "NVM Command Set 1.0d, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-NVM-Command-Set-Specification-1.0d-2023.12.28-Ratified.pdf"
      },
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      }
    ]
  },
  {
    "id": "CV144",
    "group": "resume",
    "title": "最後一道：同時慢、reset、重用與斷電",
    "topic": "12 FTL 斷電與綜合故障",
    "scope": "role_extension",
    "basis": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案",
    "level": "PCIe SSD 職務延伸／極難",
    "mode": "self",
    "body": "履歷依據：PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案\n\n範圍：PCIe SSD 職務延伸／極難\n\n系統高queue depth寫入，GC接近reserve，host timeout觸發reset，舊completion晚到，接著斷電。給你白板，先定義哪些資料必須保住。\n\n主管追問：\n1. 從host承諾、request壽命到FTL提交，列出三層不變數。\n2. 哪些buffer還可能被DMA，何時能回收？\n3. 重開機後如何區分已承諾、未承諾與結果未知的write？\n4. 如何切成可重現的故障注入測試，而不是一個永遠無法定位的大測試？",
    "reference": "### 判分要點\n- 先固定故障模型、命令/持久化契約與平台邊界\n- 分開分析host回收安全、controller請求狀態與媒體恢復\n- 建立逐步可驗證的不變數再組合\n\n### 必須拿出的證據\n交付一份狀態圖、斷電切點表、失敗判準與最小trace清單。\n\n答出名詞不等於通過。請指出自己實際採用的方案；未實作的部分要標成設計提案，不能編造測量結果或專案經驗。",
    "source": {
      "file": "resume.pdf",
      "page": 1,
      "claim": "PCIe SSD 職務延伸：FTL、NAND、持久化、QoS；不是履歷已完成的專案"
    },
    "sources": [
      {
        "title": "NVM Command Set 1.0d, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-NVM-Command-Set-Specification-1.0d-2023.12.28-Ratified.pdf"
      },
      {
        "title": "NVMe Base 2.0e, fixed reference version",
        "url": "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0e-2024.07.29-Ratified.pdf"
      }
    ]
  }
];
