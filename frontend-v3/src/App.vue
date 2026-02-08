<script setup>
import { ref, computed } from "vue";
import {
  Camera,
  ChevronRight,
  Bomb,
  Hourglass,
  Trophy,
  TrendingDown,
  Calendar,
  ShieldAlert,
  Loader2,
  Share2,
  RefreshCw,
  X,
} from "lucide-vue-next";
import axios from "axios";
import { toPng } from "html-to-image";

// State
const currentPage = ref("home"); // home, upload, waiting, report
const isUploading = ref(false);
const selectedFile = ref(null);
const previewUrl = ref(null);
const analysisResult = ref(null);
const logs = ref([]);
const progress = ref(0);
const reportRef = ref(null);

// Mock Backend URL (uses environment variable on production, fallback to production URL if on Vercel)
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (window.location.hostname.includes("vercel.app")
    ? "https://where-is-my-money2-new.vercel.app"
    : "http://localhost:3000");

// --- Actions ---

const startAudit = () => {
  currentPage.value = "upload";
};

const handleFileSelect = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

const removeFile = () => {
  selectedFile.value = null;
  previewUrl.value = null;
};

const confirmAnalysis = async () => {
  if (!selectedFile.value) return;

  currentPage.value = "waiting";
  simulateProgress();

  try {
    const formData = new FormData();
    formData.append("bill", selectedFile.value);

    // 1. Upload
    const uploadRes = await axios.post(`${API_BASE}/api/upload`, formData);
    const filename = uploadRes.data.filename;

    // 2. Analyze
    const analyzeRes = await axios.post(`${API_BASE}/api/analyze`, {
      filename,
    });
    analysisResult.value = analyzeRes.data;

    // Finish progress after a short delay for animation
    setTimeout(() => {
      progress.value = 100;
      setTimeout(() => {
        currentPage.value = "report";
      }, 500);
    }, 2000);
  } catch (error) {
    console.error("Analysis failed", error);
    alert("审计失败，请检查后端服务是否启动");
    currentPage.value = "upload";
  }
};

const simulateProgress = () => {
  progress.value = 0;
  logs.value = [];
  const script = [
    { p: 10, m: "正在读取商家列表..." },
    { p: 25, m: "发现 3 笔凌晨消费，你还没死呢？" },
    { p: 40, m: "正在计算恩格尔系数..." },
    { p: 55, m: "正在与上海平均工资对比... 惨不忍睹。" },
    { p: 70, m: "检测到含糖量过高的消费..." },
    { p: 85, m: "AI 发出了一声叹息..." },
    { p: 95, m: "正在组织最扎心的语言..." },
  ];

  let i = 0;
  const interval = setInterval(() => {
    if (i < script.length) {
      progress.value = script[i].p;
      logs.value.push(script[i].m);
      i++;
    } else {
      clearInterval(interval);
    }
  }, 1000);
};

const saveReport = async () => {
  if (reportRef.value) {
    const dataUrl = await toPng(reportRef.value);
    const link = document.createElement("a");
    link.download = "我钱呢-审计报告.png";
    link.href = dataUrl;
    link.click();
  }
};

const reset = () => {
  currentPage.value = "home";
  selectedFile.value = null;
  previewUrl.value = null;
  analysisResult.value = null;
};
</script>

<template>
  <div class="page-root">
    <div class="content-shell p-6 md:p-8">
      <!-- Header -->
      <header class="w-full py-8 text-center animate-fade-in">
        <h1
          class="text-4xl md:text-5xl font-extrabold text-primary mb-2 tracking-tighter"
        >
          我钱呢？
        </h1>
        <p class="text-gray-500 font-medium italic">你的私人财务毒舌审计师</p>
      </header>

      <!-- Page 1: Home -->
      <main
        v-if="currentPage === 'home'"
        class="w-full flex flex-col gap-6 animate-slide-up"
      >
        <div class="flex flex-col items-center gap-4">
          <button
            @click="startAudit"
            class="btn-primary w-full flex-center gap-2 text-xl py-4"
          >
            <Camera :size="24" />
            开始审计
          </button>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            class="card flex flex-col items-center gap-2 text-center"
            @click="alert('上传账单后解锁此项分析')"
          >
            <Bomb class="text-orange-500" />
            <span class="text-sm font-bold">隐形刺客</span>
          </div>
          <div
            class="card flex flex-col items-center gap-2 text-center"
            @click="alert('上传账单后解锁此项分析')"
          >
            <Hourglass class="text-red-500" />
            <span class="text-sm font-bold">贫穷倒计</span>
          </div>
          <div
            class="card flex flex-col items-center gap-2 text-center"
            @click="alert('上传账单后解锁此项分析')"
          >
            <Trophy class="text-yellow-500" />
            <span class="text-sm font-bold">梦想进度</span>
          </div>
          <div
            class="card flex flex-col items-center gap-2 text-center"
            @click="alert('上传账单后解锁此项分析')"
          >
            <TrendingDown class="text-blue-500" />
            <span class="text-sm font-bold">消费降级</span>
          </div>
          <div
            class="card flex flex-col items-center gap-2 text-center"
            @click="alert('上传账单后解锁此项分析')"
          >
            <Calendar class="text-green-500" />
            <span class="text-sm font-bold">明日预算</span>
          </div>
          <div
            class="card flex flex-col items-center gap-2 text-center"
            @click="alert('上传账单后解锁此项分析')"
          >
            <ShieldAlert class="text-purple-500" />
            <span class="text-sm font-bold">止血方案</span>
          </div>
        </div>

        <div
          class="mt-8 text-center bg-gray-100 p-4 rounded-xl border border-gray-200"
        >
          <p
            class="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold"
          >
            三步走向清醒
          </p>
          <div
            class="flex justify-between items-center text-xs font-bold text-gray-600 px-4"
          >
            <span>截图</span>
            <ChevronRight :size="12" />
            <span>上传</span>
            <ChevronRight :size="12" />
            <span>出报告</span>
          </div>
        </div>
      </main>

      <!-- Page 2: Upload -->
      <main
        v-if="currentPage === 'upload'"
        class="w-full flex flex-col gap-6 animate-slide-up"
      >
        <h2 class="text-2xl font-bold text-center mb-4">账单“大审判”</h2>

        <div
          class="border-4 border-dashed border-gray-300 rounded-3xl h-64 flex-center flex-col gap-4 relative overflow-hidden"
          :class="{ 'border-primary': selectedFile }"
        >
          <input
            type="file"
            accept="image/*"
            class="absolute inset-0 opacity-0 cursor-pointer z-10"
            @change="handleFileSelect"
          />

          <template v-if="!previewUrl">
            <div class="bg-gray-100 p-4 rounded-full">
              <Camera :size="48" class="text-gray-400" />
            </div>
            <p class="text-gray-400 font-bold">点此上传月度账单长截图</p>
          </template>

          <template v-else>
            <img :src="previewUrl" class="w-full h-full object-cover" />
            <button
              @click.stop="removeFile"
              class="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full z-20"
            >
              <X :size="20" />
            </button>
          </template>
        </div>

        <div class="bg-gray-100 p-6 rounded-2xl">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xl">💡</span>
            <h3 class="font-bold">为了骂得更准：</h3>
          </div>
          <ul class="text-sm text-gray-600 space-y-2 font-medium">
            <li>
              • <span class="text-primary font-bold">必须包含“总支出”金额</span>
            </li>
            <li>• 建议使用长截图，包含明细更扎心</li>
            <li>• 支持微信/支付宝/各大银行 App</li>
          </ul>
        </div>

        <button
          @click="confirmAnalysis"
          :disabled="!selectedFile"
          class="btn-primary w-full disabled:bg-gray-300 disabled:hover:scale-100 mt-4"
        >
          确认并分析
        </button>
      </main>

      <!-- Page 3: Waiting -->
      <main
        v-if="currentPage === 'waiting'"
        class="w-full flex-center flex-col gap-8 py-12 animate-fade-in"
      >
        <div class="relative w-48 h-48 flex-center">
          <div
            class="absolute inset-0 border-8 border-primary/20 rounded-full"
          ></div>
          <div
            class="absolute inset-0 border-8 border-primary rounded-full border-t-transparent animate-spin"
          ></div>
          <Loader2 :size="64" class="text-primary animate-pulse" />
        </div>

        <div class="w-full px-4">
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
            <div
              class="h-full bg-primary transition-all duration-500 ease-out"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>

          <div class="h-32 overflow-hidden relative">
            <TransitionGroup
              name="list"
              tag="div"
              class="flex flex-col-reverse gap-2"
            >
              <div
                v-for="(log, idx) in logs"
                :key="idx"
                class="text-sm font-mono text-gray-500 border-l-2 border-primary pl-3 py-1"
              >
                {{ log }}
              </div>
            </TransitionGroup>
          </div>
        </div>
      </main>

      <!-- Page 4: Report -->
      <main
        v-if="currentPage === 'report'"
        class="w-full flex flex-col gap-6 animate-slide-up pb-12"
      >
        <div
          ref="reportRef"
          class="bg-white p-6 rounded-3xl shadow-2xl border-4 border-dark overflow-hidden"
        >
          <!-- Report Header -->
          <div class="border-b-4 border-dark pb-4 mb-6">
            <h2 class="text-3xl font-black italic uppercase">Verdict</h2>
            <div class="flex justify-between text-xs font-bold font-mono">
              <span>OFFICIAL AUDIT REPORT</span>
              <span>NO. {{ Date.now() }}</span>
            </div>
          </div>

          <!-- Ranking -->
          <div class="mb-8">
            <h3
              class="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest"
            >
              财力定级 / RANKING
            </h3>
            <div class="flex flex-col gap-2">
              <div
                v-for="rank in [
                  '个人破产',
                  '恩格尔守门员',
                  '消费主义韭菜',
                  '人间清醒',
                ]"
                :key="rank"
                class="px-4 py-2 rounded-lg font-bold transition-all"
                :class="
                  analysisResult.ranking === rank
                    ? 'bg-primary text-white scale-105 shadow-md'
                    : 'bg-gray-100 text-gray-400 blur-[0.5px]'
                "
              >
                {{ rank }}
                <span v-if="analysisResult.ranking === rank" class="float-right"
                  >👈</span
                >
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div class="mb-8">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in analysisResult.tags"
                :key="tag"
                class="px-3 py-1 bg-dark text-white text-xs font-black rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Roast -->
          <div class="mb-8 p-4 bg-primary/5 border-l-4 border-primary italic">
            <p class="text-dark font-serif text-lg leading-relaxed">
              "{{ analysisResult.roast }}"
            </p>
          </div>

          <!-- Extra Info (Shared Card only area simulation) -->
          <div class="bg-dark text-white p-6 rounded-2xl text-center">
            <p class="text-[10px] uppercase tracking-widest opacity-50 mb-2">
              距离在上海买房还差
            </p>
            <p class="text-3xl font-black text-primary">
              {{ analysisResult.countdown }}
            </p>
          </div>

          <div class="mt-6 flex justify-between items-end">
            <div class="text-[10px] font-mono text-gray-400">
              AUDITED BY AI-WA-QIAN-NE<br />
              DETERMINISTIC FINANCIAL DOOM
            </div>
            <div
              class="w-16 h-16 bg-gray-100 rounded-lg flex-center border border-gray-200"
            >
              <span class="text-[8px] text-gray-300 text-center px-1"
                >扫码看你搬砖多少年</span
              >
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <button
            @click="saveReport"
            class="btn-primary w-full flex-center gap-2"
          >
            <Share2 :size="20" />
            保存报告
          </button>
          <button
            @click="reset"
            class="px-6 py-3 border-4 border-dark rounded-full font-bold flex-center gap-2 hover:bg-dark hover:text-white transition-colors"
          >
            <RefreshCw :size="20" />
            再测一次
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=EB+Garamond:ital,wght@1,400;1,700&display=swap");

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-slide-up {
  animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* List Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
