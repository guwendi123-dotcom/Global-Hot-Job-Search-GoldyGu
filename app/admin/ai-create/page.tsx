"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Send, Loader2, AlertCircle, Check, History, Trash2, Eye, Upload, Download } from "lucide-react";

// 历史记录类型
interface HistoryItem {
  id: string;
  timestamp: string;
  input: string;
  prompt: string;
  result: string;
  type: "job" | "company" | "industry";
  status: "success" | "failed";
}

// API Key 配置
const API_KEY_STORAGE = "ai_create_api_key";

// 默认提示词
const DEFAULT_PROMPT = `你的角色是一个专业的猎头顾问，擅长创建岗位描述和公司介绍。

请根据用户提供的内容，生成高质量的岗位或公司信息。

规则：
1. 输出必须是有效的 JSON 格式
2. 岗位必须包含：id, title, titleEn, description, descriptionEn, location, locationEn, workMode, workModeEn, jobType, jobTypeEn, tags, tagsEn, profile, companyId, sort
3. 公司必须包含：id, name, nameEn, description, descriptionEn, stage, stageEn, location, locationEn, industryId, logo, sort
4. 使用中文和英文双语
5. 描述要专业、详细、有吸引力
6. 如果信息不完整，使用合理的默认值

请生成 2-3 个不同版本的 JSON，用户可以选择最喜欢的一个。`;

export default function AICreatePage() {
  // 输入内容
  const [input, setInput] = useState("");
  // 诉求/提示词
  const [prompt, setPrompt] = useState("");
  // 生成类型
  const [contentType, setContentType] = useState<"job" | "company" | "industry">("job");
  // API Key
  const [apiKey, setApiKey] = useState("");
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 生成结果
  const [results, setResults] = useState<string[]>([]);
  // 选中的结果
  const [selectedResult, setSelectedResult] = useState<number>(0);
  // 历史记录
  const [history, setHistory] = useState<HistoryItem[]>([]);
  // 显示历史
  const [showHistory, setShowHistory] = useState(false);
  // 错误信息
  const [error, setError] = useState("");
  // 发布成功
  const [publishSuccess, setPublishSuccess] = useState(false);

  // 加载 API Key 和历史记录
  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE);
    if (savedKey) {
      setApiKey(savedKey);
    }

    const savedHistory = localStorage.getItem("ai_create_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  // 保存历史记录
  const saveHistory = (item: HistoryItem) => {
    const newHistory = [item, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("ai_create_history", JSON.stringify(newHistory));
  };

  // 生成内容
  const handleGenerate = async () => {
    if (!input.trim()) {
      setError("请输入内容");
      return;
    }
    if (!apiKey.trim()) {
      setError("请先配置 API Key");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    setPublishSuccess(false);

    // 保存 API Key
    localStorage.setItem(API_KEY_STORAGE, apiKey);

    const typeLabels = {
      job: "岗位",
      company: "公司",
      industry: "行业"
    };

    const userMessage = `请帮我生成一个${typeLabels[contentType]}。

现有内容/需求：
${input}

${prompt ? `修改诉求：${prompt}` : ""}

请生成 2 个不同版本的 JSON 供我选择。`;

    try {
      const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "Qwen/Qwen2.5-7B-Instruct",
          messages: [
            {
              role: "system",
              content: DEFAULT_PROMPT
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.8,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        throw new Error(`API 调用失败: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("API 返回内容为空");
      }

      // 尝试提取 JSON
      const jsonMatches = content.match(/```json[\s\S]*?```/g) || content.match(/\[[\s\S]*\]/g) || [];

      if (jsonMatches.length > 0) {
        const parsedResults = jsonMatches.map((m: string) => {
          return m.replace(/```json|```/g, "").trim();
        });
        setResults(parsedResults);
      } else {
        // 没有找到 JSON，整体作为结果
        setResults([content]);
      }

      // 保存到历史
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        input,
        prompt,
        result: content,
        type: contentType,
        status: "success"
      };
      saveHistory(historyItem);

    } catch (err: any) {
      setError(err.message || "生成失败，请重试");

      // 保存失败记录
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        input,
        prompt,
        result: "",
        type: contentType,
        status: "failed"
      };
      saveHistory(historyItem);
    } finally {
      setLoading(false);
    }
  };

  // 下载 JSON 文件
  const handleDownload = () => {
    if (!results[selectedResult]) return;

    try {
      // 尝试解析并格式化 JSON
      const jsonData = JSON.parse(results[selectedResult]);
      const formattedJson = JSON.stringify(jsonData, null, 2);

      // 根据类型生成文件名
      const timestamp = new Date().toISOString().slice(0, 10);
      const fileName = `${contentType}_${timestamp}.json`;

      // 创建下载
      const blob = new Blob([formattedJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);

      // 显示成功
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 3000);

    } catch (err: any) {
      setError("JSON 格式错误，无法下载: " + err.message);
    }
  };

  // 复制到剪贴板
  const handleCopy = async () => {
    if (!results[selectedResult]) return;

    try {
      await navigator.clipboard.writeText(results[selectedResult]);
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 3000);
    } catch (err: any) {
      setError("复制失败: " + err.message);
    }
  };

  // 清除历史
  const clearHistory = () => {
    if (confirm("确定清除所有历史记录吗？")) {
      setHistory([]);
      localStorage.removeItem("ai_create_history");
    }
  };

  // 删除单条历史
  const deleteHistoryItem = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem("ai_create_history", JSON.stringify(newHistory));
  };

  // 重新加载历史项
  const loadHistoryItem = (item: HistoryItem) => {
    setInput(item.input);
    setPrompt(item.prompt);
    setContentType(item.type);
    setShowHistory(false);
  };

  return (
    <main className="min-h-screen bg-bg-primary">
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/admin" className="text-text-secondary hover:text-accent">
              <ArrowLeft size={20} />
            </a>
            <h1 className="text-xl font-bold text-text-primary">AI 创作助手</h1>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-accent"
          >
            <History size={18} />
            历史记录 ({history.length})
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 历史记录侧边栏 */}
        {showHistory && (
          <div className="mb-8 bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">历史记录</h2>
              <button
                onClick={clearHistory}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
              >
                <Trash2 size={14} />
                清除全部
              </button>
            </div>

            {history.length === 0 ? (
              <p className="text-text-secondary text-center py-8">暂无历史记录</p>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-bg-primary rounded-xl"
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => loadHistoryItem(item)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          item.type === "job" ? "bg-blue-100 text-blue-600" :
                          item.type === "company" ? "bg-green-100 text-green-600" :
                          "bg-purple-100 text-purple-600"
                        }`}>
                          {item.type === "job" ? "岗位" : item.type === "company" ? "公司" : "行业"}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {new Date(item.timestamp).toLocaleString("zh-CN")}
                        </span>
                        <span className={`text-xs ${item.status === "success" ? "text-green-500" : "text-red-500"}`}>
                          {item.status === "success" ? "成功" : "失败"}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary truncate">
                        {item.input.substring(0, 50)}...
                      </p>
                    </div>
                    <button
                      onClick={() => deleteHistoryItem(item.id)}
                      className="p-2 text-text-secondary hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：输入区 */}
          <div className="space-y-6">
            {/* API Key 配置 */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">API Key 配置</h2>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="请输入硅基流动 API Key"
                className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
              />
              <p className="text-xs text-text-secondary mt-2">
                API Key 仅保存在浏览器本地，不会上传到服务器
              </p>
            </div>

            {/* 内容类型选择 */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">生成类型</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setContentType("job")}
                  className={`flex-1 px-4 py-3 rounded-xl border ${
                    contentType === "job"
                      ? "border-accent bg-accent-light text-accent"
                      : "border-border text-text-secondary hover:border-accent"
                  }`}
                >
                  岗位
                </button>
                <button
                  onClick={() => setContentType("company")}
                  className={`flex-1 px-4 py-3 rounded-xl border ${
                    contentType === "company"
                      ? "border-accent bg-accent-light text-accent"
                      : "border-border text-text-secondary hover:border-accent"
                  }`}
                >
                  公司
                </button>
                <button
                  onClick={() => setContentType("industry")}
                  className={`flex-1 px-4 py-3 rounded-xl border ${
                    contentType === "industry"
                      ? "border-accent bg-accent-light text-accent"
                      : "border-border text-text-secondary hover:border-accent"
                  }`}
                >
                  行业
                </button>
              </div>
            </div>

            {/* 输入内容 */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                {contentType === "job" ? "岗位信息" : contentType === "company" ? "公司信息" : "行业信息"}
              </h2>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={"粘贴 JSON 或输入自然语言描述\n\n例如：帮我生成一个深圳的算法工程师岗位，薪资 50-80K，要求 3-5 年经验"}
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:outline-none min-h-[200px] font-mono text-sm"
              />
            </div>

            {/* 修改诉求 */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">修改诉求（可选）</h2>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={"描述你想要怎么修改\n\n例如：薪资改成 80-120K，地点改成北京"}
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:outline-none min-h-[100px]"
              />
            </div>

            {/* 生成按钮 */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Send size={20} />
                  生成内容
                </>
              )}
            </button>
          </div>

          {/* 右侧：预览区 */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-border p-6 min-h-[600px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text-primary">预览</h2>
                {results.length > 0 && (
                  <span className="text-sm text-text-secondary">
                    {results.length} 个版本
                  </span>
                )}
              </div>

              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-text-secondary">
                  <Eye size={48} className="mb-4 opacity-30" />
                  <p>生成内容后将显示在此处</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* 版本选择 */}
                  <div className="flex gap-2">
                    {results.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedResult(index)}
                        className={`px-4 py-2 rounded-lg text-sm ${
                          selectedResult === index
                            ? "bg-accent text-white"
                            : "bg-bg-primary text-text-secondary hover:bg-gray-100"
                        }`}
                      >
                        版本 {index + 1}
                      </button>
                    ))}
                  </div>

                  {/* 卡片预览 - 渲染效果 */}
                  <div className="bg-bg-primary rounded-xl p-4 max-h-[400px] overflow-auto">
                    {(() => {
                      let jsonData = null;
                      let parseError = false;

                      // 尝试提取 JSON
                      try {
                        const raw = results[selectedResult];
                        // 尝试找 ```json ... ``` 块
                        const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/);
                        if (jsonMatch) {
                          jsonData = JSON.parse(jsonMatch[1]);
                        } else {
                          jsonData = JSON.parse(raw);
                        }
                      } catch (e) {
                        parseError = true;
                      }

                      // 如果解析成功，显示卡片
                      if (!parseError && jsonData) {
                        const items = Array.isArray(jsonData) ? jsonData : [jsonData];

                        return items.map((item: any, idx: number) => (
                          <div key={idx} className="bg-white rounded-xl border border-border p-4 mb-4 last:mb-0">
                            {contentType === "job" && (
                              <>
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="font-semibold text-text-primary">{item.title || item.titleEn}</h3>
                                  <span className="text-xs text-text-secondary">{item.location}</span>
                                </div>
                                <p className="text-sm text-text-secondary line-clamp-3">{item.description?.substring(0, 150)}...</p>
                                <div className="flex gap-2 mt-3">
                                  {item.tags?.slice(0, 3).map((tag: string, i: number) => (
                                    <span key={i} className="text-xs px-2 py-1 bg-accent-light text-accent rounded-full">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </>
                            )}

                            {contentType === "company" && (
                              <>
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="font-semibold text-text-primary">{item.name || item.nameEn}</h3>
                                  <span className="text-xs text-text-secondary">{item.stage}</span>
                                </div>
                                <p className="text-sm text-text-secondary line-clamp-3">{item.description?.substring(0, 150)}...</p>
                                <div className="flex items-center gap-2 mt-3 text-xs text-text-secondary">
                                  <span>📍 {item.location}</span>
                                </div>
                              </>
                            )}

                            {contentType === "industry" && (
                              <>
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="font-semibold text-text-primary">{item.name || item.nameEn}</h3>
                                </div>
                                <p className="text-sm text-text-secondary line-clamp-3">{item.description?.substring(0, 150)}...</p>
                              </>
                            )}
                          </div>
                        ));
                      } catch (e) {
                        // 如果解析失败，显示原始代码
                        return (
                          <pre className="text-xs font-mono whitespace-pre-wrap">
                            {results[selectedResult]}
                          </pre>
                        );
                      }
                    })()}
                  </div>

                  {/* JSON 代码 - 可折叠 */}
                  <details className="mt-4">
                    <summary className="text-sm text-text-secondary cursor-pointer hover:text-accent">
                      查看原始 JSON
                    </summary>
                    <pre className="text-xs font-mono whitespace-pre-wrap mt-2 p-4 bg-gray-800 text-green-400 rounded-xl max-h-[200px] overflow-auto">
                      {results[selectedResult]}
                    </pre>
                  </details>

                  {/* 复制和下载按钮 */}
                  {publishSuccess ? (
                    <div className="flex items-center justify-center gap-2 p-4 bg-green-50 text-green-600 rounded-xl">
                      <Check size={20} />
                      操作成功！复制成功后将内容粘贴到对应管理页面即可
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-text-secondary">
                        复制或下载 JSON 后，去对应管理页面添加
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={handleCopy}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-accent text-white rounded-xl hover:bg-orange-600"
                        >
                          <Upload size={20} />
                          复制内容
                        </button>
                        <button
                          onClick={handleDownload}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                        >
                          <Download size={20} />
                          下载 JSON
                        </button>
                      </div>
                      <div className="flex gap-3">
                        <a
                          href={contentType === "job" ? "/admin/jobs" : contentType === "company" ? "/admin/companies" : "/admin"}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-border text-text-secondary rounded-xl hover:border-accent hover:text-accent text-center"
                        >
                          去{contentType === "job" ? "岗位管理" : contentType === "company" ? "公司管理" : "管理后台"}手动添加
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}