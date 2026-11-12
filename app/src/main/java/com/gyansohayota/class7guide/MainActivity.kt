package com.gyansohayota.class7guide

import android.animation.ObjectAnimator
import android.animation.ValueAnimator
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.view.animation.AccelerateDecelerateInterpolator
import android.view.animation.DecelerateInterpolator
import android.view.animation.OvershootInterpolator
import android.webkit.ConsoleMessage
import android.webkit.JavascriptInterface
import android.webkit.RenderProcessGoneDetail
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.ImageView
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.widget.FrameLayout
import androidx.activity.SystemBarStyle
import androidx.activity.enableEdgeToEdge
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import com.bumptech.glide.Glide
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.appopen.AppOpenAd
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback
import android.app.Dialog
import android.os.CountDownTimer
import android.graphics.drawable.GradientDrawable
import android.view.Gravity
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.os.Handler
import android.os.Looper
import com.google.android.gms.ads.RequestConfiguration
import org.json.JSONObject

class MainActivity : ComponentActivity() {

    companion object {
        // Google AdMob Official Test Ad Unit IDs
        // Replace these with your real AdMob Unit IDs when you want real ads
        const val AD_UNIT_APP_OPEN = "ca-app-pub-3940256099942544/9257395921"
        const val AD_UNIT_INTERSTITIAL = "ca-app-pub-3940256099942544/1033173712"
        const val AD_UNIT_REWARDED = "ca-app-pub-3940256099942544/5224354917"
        const val AD_UNIT_BANNER = "ca-app-pub-3940256099942544/6300978111"
    }

    private lateinit var webView: WebView
    private val logTag = "WebView"

    private var currentBottomInset = 0

    // AdMob State Management
    private var appOpenAd: AppOpenAd? = null
    private var isAppOpenLoading = false
    private var hasShownInitialAppOpen = false
    private var isSplashFinished = false
    private var pendingShowAppOpen = false
    private var isShowingFullScreenAd = false

    private var interstitialAd: InterstitialAd? = null
    private var isInterstitialLoading = false
    private var pendingInterstitialActionKey: String? = null
    private val mainHandler = Handler(Looper.getMainLooper())
    private var interstitialTimeoutRunnable: Runnable? = null
    private var interstitialRetryCount = 0

    private var rewardedAd: RewardedAd? = null
    private var isRewardedLoading = false
    private var pendingRewardedActionKey: String? = null
    private var rewardedTimeoutRunnable: Runnable? = null
    private var rewardedRetryCount = 0
    private var appOpenRetryCount = 0

    private var bannerAdView: AdView? = null
    private var isBannerVisible = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge(
            statusBarStyle = SystemBarStyle.light(
                Color.TRANSPARENT,
                Color.TRANSPARENT
            ),
            navigationBarStyle = SystemBarStyle.light(
                Color.TRANSPARENT,
                Color.TRANSPARENT
            )
        )
        setContentView(R.layout.activity_main)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.isStatusBarContrastEnforced = false
            window.isNavigationBarContrastEnforced = false
        }

        // Initialize Google Mobile Ads SDK with test environment
        try {
            val testDeviceIds = listOf(AdRequest.DEVICE_ID_EMULATOR)
            val configuration = RequestConfiguration.Builder()
                .setTestDeviceIds(testDeviceIds)
                .build()
            MobileAds.setRequestConfiguration(configuration)

            MobileAds.initialize(this) { status ->
                Log.d(logTag, "MobileAds initialized: ${status.adapterStatusMap}")
                runOnUiThread {
                    setupBannerAd()
                    loadAppOpenAd()
                    mainHandler.postDelayed({ loadInterstitialAd() }, 600L)
                    mainHandler.postDelayed({ loadRewardedAd() }, 1400L)
                }
            }
        } catch (e: Exception) {
            Log.e(logTag, "MobileAds initialization error", e)
        }
        val defaultSkyColor = Color.parseColor("#38bdf8")
        window.statusBarColor = defaultSkyColor
        window.navigationBarColor = defaultSkyColor

        val insetsController = WindowCompat.getInsetsController(window, window.decorView)
        insetsController.isAppearanceLightStatusBars = false
        insetsController.isAppearanceLightNavigationBars = false

        // Ensure cache directories exist for WebView/Chromium
        try {
            cacheDir.mkdirs()
            codeCacheDir.mkdirs()
            java.io.File(cacheDir, "WebView/Default/HTTP Cache/Code Cache/js").mkdirs()
        } catch (_: Exception) {}

        webView = findViewById(R.id.webView)
        val splashOverlay = findViewById<View>(R.id.splashOverlay)

        // Set webview background to opaque theme color for stability in Mesa software renderer
        webView.setBackgroundColor(Color.parseColor("#f0f9ff"))

        val splashStartTime = System.currentTimeMillis()
        val minSplashDurationMs = 1500L
        var hasDismissedSplash = false

        fun dismissSplash() {
            if (hasDismissedSplash) return
            val elapsed = System.currentTimeMillis() - splashStartTime
            val remaining = (minSplashDurationMs - elapsed).coerceAtLeast(100L)
            splashOverlay.postDelayed({
                if (!hasDismissedSplash) {
                    hasDismissedSplash = true
                    splashOverlay.animate()
                        .alpha(0f)
                        .scaleX(1.04f)
                        .scaleY(1.04f)
                        .setDuration(380L)
                        .setInterpolator(DecelerateInterpolator())
                        .withEndAction {
                            splashOverlay.visibility = View.GONE
                            onSplashDismissed()
                        }
                        .start()
                }
            }, remaining)
        }

        // Safety fallback so splash is never stuck
        splashOverlay.postDelayed({ dismissSplash() }, 2800L)

        val root = findViewById<View>(R.id.rootLayout)
        ViewCompat.setOnApplyWindowInsetsListener(root) { view, insets ->
            val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            currentBottomInset = bars.bottom
            val lp = webView.layoutParams as? ViewGroup.MarginLayoutParams
            val bannerHeightPx = if (isBannerVisible) (54 * resources.displayMetrics.density).toInt() else 0
            if (lp != null) {
                lp.topMargin = bars.top
                lp.bottomMargin = bars.bottom + bannerHeightPx
                lp.leftMargin = bars.left
                lp.rightMargin = bars.right
                webView.layoutParams = lp
            }
            val container = findViewById<FrameLayout>(R.id.bannerContainer)
            val containerLp = container?.layoutParams as? ViewGroup.MarginLayoutParams
            if (containerLp != null) {
                containerLp.bottomMargin = bars.bottom
                container?.layoutParams = containerLp
            }
            insets
        }

        val isDebuggable = (applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE) != 0
        WebView.setWebContentsDebuggingEnabled(isDebuggable)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            allowFileAccessFromFileURLs = true
            allowUniversalAccessFromFileURLs = true
            mediaPlaybackRequiresUserGesture = false
            cacheMode = WebSettings.LOAD_DEFAULT
        }

        class WebAppInterface {
            @JavascriptInterface
            fun onAppReady() {
                runOnUiThread { dismissSplash() }
            }

            @JavascriptInterface
            fun openExternalUrl(url: String) {
                runOnUiThread {
                    try {
                        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                    } catch (e: Exception) {
                        Log.e(logTag, "Failed to open external url=$url", e)
                    }
                }
            }

            @JavascriptInterface
            fun triggerInterstitialAdWithAction(actionKey: String) {
                runOnUiThread {
                    showInterstitialAd(actionKey)
                }
            }

            @JavascriptInterface
            fun triggerInterstitialAd() {
                runOnUiThread {
                    showInterstitialAd(null)
                }
            }

            @JavascriptInterface
            fun triggerRewardedAdWithAction(actionKey: String) {
                runOnUiThread {
                    showRewardedAd(actionKey)
                }
            }

            @JavascriptInterface
            fun showBannerAd(show: Boolean) {
                runOnUiThread {
                    setBannerAdVisible(show)
                }
            }

            @JavascriptInterface
            fun isNetworkAvailable(): Boolean {
                val cm = getSystemService(android.content.Context.CONNECTIVITY_SERVICE) as? ConnectivityManager ?: return false
                val network = cm.activeNetwork ?: return false
                val caps = cm.getNetworkCapabilities(network) ?: return false
                return caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
            }

            @JavascriptInterface
            fun exitApp() {
                runOnUiThread { finish() }
            }

            private fun extractDriveId(url: String): String? {
                val m1 = Regex("/file/d/([a-zA-Z0-9_-]+)").find(url)
                if (m1 != null) return m1.groupValues[1]
                val m2 = Regex("[?&]id=([a-zA-Z0-9_-]+)").find(url)
                if (m2 != null) return m2.groupValues[1]
                return null
            }

            private fun isPdfFileValid(file: java.io.File): Boolean {
                if (!file.exists() || file.length() < 2000) return false
                return try {
                    java.io.FileInputStream(file).use { input ->
                        val header = ByteArray(4)
                        val read = input.read(header)
                        read == 4 && header[0] == 0x25.toByte() && header[1] == 0x50.toByte() && header[2] == 0x44.toByte() && header[3] == 0x46.toByte()
                    }
                } catch (_: Exception) {
                    false
                }
            }

            @JavascriptInterface
            fun downloadPdf(chapterId: String, downloadUrl: String, callbackJs: String) {
                Thread {
                    val cacheDir = java.io.File(cacheDir, "pdf_cache")
                    if (!cacheDir.exists()) cacheDir.mkdirs()
                    val pdfFile = java.io.File(cacheDir, "$chapterId.pdf")
                    val tempFile = java.io.File(cacheDir, "$chapterId.tmp")

                    if (isPdfFileValid(pdfFile)) {
                        val fileUri = "file://${pdfFile.absolutePath}"
                        val totalMb = String.format(java.util.Locale.US, "%.1f", pdfFile.length() / (1024.0 * 1024.0))
                        runOnUiThread {
                            val js100 = """
                                (function() {
                                    if (window.__onDownloadProgress) window.__onDownloadProgress(100, '$totalMb', '$totalMb');
                                    var iframes = document.querySelectorAll('iframe');
                                    for (var i = 0; i < iframes.length; i++) {
                                        try {
                                            if (iframes[i].contentWindow && iframes[i].contentWindow.__onDownloadProgress) {
                                                iframes[i].contentWindow.__onDownloadProgress(100, '$totalMb', '$totalMb');
                                            }
                                        } catch(e) {}
                                    }
                                    try { eval("$callbackJs('$fileUri')"); } catch(e) {}
                                    for (var j = 0; j < iframes.length; j++) {
                                        try {
                                            if (iframes[j].contentWindow) {
                                                iframes[j].contentWindow.eval("$callbackJs('$fileUri')");
                                            }
                                        } catch(e) {}
                                    }
                                })();
                            """.trimIndent()
                            webView.evaluateJavascript(js100, null)
                        }
                        return@Thread
                    }

                    val driveId = extractDriveId(downloadUrl)
                    val urlCandidates = mutableListOf<String>()
                    if (driveId != null) {
                        urlCandidates.add("https://drive.usercontent.google.com/download?id=$driveId&export=download&authuser=0&confirm=t")
                        urlCandidates.add("https://drive.google.com/uc?export=download&id=$driveId&confirm=t")
                        urlCandidates.add("https://docs.google.com/uc?export=download&id=$driveId")
                    } else {
                        urlCandidates.add(downloadUrl)
                    }

                    var downloadSuccess = false
                    var finalTotalBytes = 0L

                    for (candidate in urlCandidates) {
                        if (downloadSuccess) break
                        try {
                            var currentUrl = candidate
                            var cookieHeader: String? = null
                            var redirects = 0

                            while (redirects < 8) {
                                val urlObj = java.net.URL(currentUrl)
                                val conn = urlObj.openConnection() as java.net.HttpURLConnection
                                conn.instanceFollowRedirects = false
                                conn.connectTimeout = 20000
                                conn.readTimeout = 40000
                                conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36")
                                conn.setRequestProperty("Accept", "*/*")
                                if (cookieHeader != null) {
                                    conn.setRequestProperty("Cookie", cookieHeader)
                                }

                                val setCookies = conn.headerFields["Set-Cookie"]
                                if (!setCookies.isNullOrEmpty()) {
                                    val cookieBuilder = StringBuilder(cookieHeader?.let { "$it; " } ?: "")
                                    for (c in setCookies) {
                                        val cookiePart = c.split(";").firstOrNull()
                                        if (!cookiePart.isNullOrEmpty()) {
                                            cookieBuilder.append(cookiePart).append("; ")
                                        }
                                    }
                                    cookieHeader = cookieBuilder.toString().trimEnd(';', ' ')
                                }

                                val status = conn.responseCode
                                if (status in 300..399) {
                                    val location = conn.getHeaderField("Location")
                                    if (location != null) {
                                        currentUrl = if (location.startsWith("http")) location else java.net.URL(urlObj, location).toString()
                                        redirects++
                                        conn.disconnect()
                                        continue
                                    }
                                }

                                val totalLength = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                                    conn.contentLengthLong
                                } else {
                                    conn.contentLength.toLong()
                                }
                                finalTotalBytes = totalLength

                                var bytesRead = 0L
                                var lastUpdate = 0L
                                val buffer = ByteArray(32768)

                                if (tempFile.exists()) tempFile.delete()

                                conn.inputStream.use { input ->
                                    java.io.FileOutputStream(tempFile).use { output ->
                                        var read: Int
                                        while (input.read(buffer).also { read = it } != -1) {
                                            output.write(buffer, 0, read)
                                            bytesRead += read
                                            val now = System.currentTimeMillis()
                                            if (now - lastUpdate > 60) {
                                                lastUpdate = now
                                                val percent = if (totalLength > 0) ((bytesRead * 100) / totalLength).toInt().coerceIn(1, 99) else ((bytesRead / 50000).toInt() % 90 + 5)
                                                val loadedMb = String.format(java.util.Locale.US, "%.1f", bytesRead / (1024.0 * 1024.0))
                                                val totalMb = if (totalLength > 0) String.format(java.util.Locale.US, "%.1f", totalLength / (1024.0 * 1024.0)) else ""
                                                runOnUiThread {
                                                    val js = """
                                                        (function() {
                                                            if (window.__onDownloadProgress) window.__onDownloadProgress($percent, '$loadedMb', '$totalMb');
                                                            var iframes = document.querySelectorAll('iframe');
                                                            for (var i = 0; i < iframes.length; i++) {
                                                                try {
                                                                    if (iframes[i].contentWindow && iframes[i].contentWindow.__onDownloadProgress) {
                                                                        iframes[i].contentWindow.__onDownloadProgress($percent, '$loadedMb', '$totalMb');
                                                                    }
                                                                } catch(e) {}
                                                            }
                                                        })();
                                                    """.trimIndent()
                                                    webView.evaluateJavascript(js, null)
                                                }
                                            }
                                        }
                                    }
                                }

                                if (isPdfFileValid(tempFile)) {
                                    if (pdfFile.exists()) pdfFile.delete()
                                    tempFile.renameTo(pdfFile)
                                    downloadSuccess = true
                                    break
                                } else {
                                    // Check if it's a Google Drive confirmation page and extract confirm url
                                    val contentText = try { tempFile.readText(Charsets.UTF_8) } catch (_: Exception) { "" }
                                    tempFile.delete()

                                    val confirmMatch = Regex("href=\"([^\"]+confirm=([^\"]+))\"").find(contentText)
                                        ?: Regex("action=\"([^\"]+)\"").find(contentText)
                                    if (confirmMatch != null) {
                                        var nextUrl = confirmMatch.groupValues[1].replace("&amp;", "&")
                                        if (!nextUrl.startsWith("http")) {
                                            nextUrl = java.net.URL(urlObj, nextUrl).toString()
                                        }
                                        currentUrl = nextUrl
                                        redirects++
                                        continue
                                    }
                                }
                                break
                            }
                        } catch (e: Exception) {
                            Log.e(logTag, "Download attempt error for candidate=$candidate", e)
                        }
                    }

                    if (downloadSuccess && isPdfFileValid(pdfFile)) {
                        val fileUri = "file://${pdfFile.absolutePath}"
                        val finalMb = String.format(java.util.Locale.US, "%.1f", pdfFile.length() / (1024.0 * 1024.0))
                        runOnUiThread {
                            val jsSuccess = """
                                (function() {
                                    if (window.__onDownloadProgress) window.__onDownloadProgress(100, '$finalMb', '$finalMb');
                                    var iframes = document.querySelectorAll('iframe');
                                    for (var i = 0; i < iframes.length; i++) {
                                        try {
                                            if (iframes[i].contentWindow && iframes[i].contentWindow.__onDownloadProgress) {
                                                iframes[i].contentWindow.__onDownloadProgress(100, '$finalMb', '$finalMb');
                                            }
                                        } catch(e) {}
                                    }
                                    try { eval("$callbackJs('$fileUri')"); } catch(e) {}
                                    for (var j = 0; j < iframes.length; j++) {
                                        try {
                                            if (iframes[j].contentWindow) {
                                                iframes[j].contentWindow.eval("$callbackJs('$fileUri')");
                                            }
                                        } catch(e) {}
                                    }
                                })();
                            """.trimIndent()
                            webView.evaluateJavascript(jsSuccess, null)
                        }
                    } else {
                        Log.e(logTag, "downloadPdf failed for $chapterId, downloadSuccess=$downloadSuccess")
                        if (tempFile.exists()) tempFile.delete()
                        runOnUiThread {
                            val jsFail = """
                                (function() {
                                    try { eval("$callbackJs(null)"); } catch(e) {}
                                    var iframes = document.querySelectorAll('iframe');
                                    for (var i = 0; i < iframes.length; i++) {
                                        try {
                                            if (iframes[i].contentWindow) {
                                                iframes[i].contentWindow.eval("$callbackJs(null)");
                                            }
                                        } catch(e) {}
                                    }
                                })();
                            """.trimIndent()
                            webView.evaluateJavascript(jsFail, null)
                        }
                    }
                }.start()
            }

            @JavascriptInterface
            fun getPdfBase64(chapterId: String): String? {
                return try {
                    val cacheDir = java.io.File(cacheDir, "pdf_cache")
                    val pdfFile = java.io.File(cacheDir, "$chapterId.pdf")
                    if (isPdfFileValid(pdfFile)) {
                        val bytes = pdfFile.readBytes()
                        android.util.Base64.encodeToString(bytes, android.util.Base64.NO_WRAP)
                    } else {
                        if (pdfFile.exists()) pdfFile.delete()
                        null
                    }
                } catch (e: Exception) {
                    Log.e(logTag, "getPdfBase64 failed for $chapterId", e)
                    null
                }
            }

            @JavascriptInterface
            fun isPdfDownloaded(chapterId: String): Boolean {
                return try {
                    val cacheDir = java.io.File(cacheDir, "pdf_cache")
                    val pdfFile = java.io.File(cacheDir, "$chapterId.pdf")
                    if (pdfFile.exists() && !isPdfFileValid(pdfFile)) {
                        pdfFile.delete()
                        false
                    } else {
                        isPdfFileValid(pdfFile)
                    }
                } catch (e: Exception) {
                    false
                }
            }

            @JavascriptInterface
            fun deletePdf(chapterId: String): Boolean {
                return try {
                    val cacheDir = java.io.File(cacheDir, "pdf_cache")
                    val pdfFile = java.io.File(cacheDir, "$chapterId.pdf")
                    if (pdfFile.exists()) {
                        pdfFile.delete()
                    } else false
                } catch (e: Exception) {
                    Log.e(logTag, "deletePdf failed for $chapterId", e)
                    false
                }
            }

            @JavascriptInterface
            fun getDownloadedChapters(): String {
                return try {
                    val cacheDir = java.io.File(cacheDir, "pdf_cache")
                    if (!cacheDir.exists()) return "[]"
                    val files = cacheDir.listFiles { file -> file.isFile && file.extension == "pdf" && file.length() > 1000 }
                    val ids = files?.map { it.nameWithoutExtension } ?: emptyList()
                    val jsonArray = org.json.JSONArray(ids)
                    jsonArray.toString()
                } catch (e: Exception) {
                    Log.e(logTag, "getDownloadedChapters failed", e)
                    "[]"
                }
            }

            @JavascriptInterface
            fun setAppTheme(themeName: String) {
                runOnUiThread {
                    applyTheme(themeName)
                }
            }

            @JavascriptInterface
            fun setSystemBarTheme(isDark: Boolean) {
                runOnUiThread {
                    applyTheme(if (isDark) "dark" else "sky")
                }
            }

            private fun applyTheme(themeName: String) {
                try {
                    val insetsController = WindowCompat.getInsetsController(window, window.decorView)
                    val rootLayout = findViewById<View>(R.id.rootLayout)
                    val appBackground = findViewById<ImageView>(R.id.appBackground)

                    when (themeName.lowercase()) {
                        "dark" -> {
                            val darkColor = Color.parseColor("#090d16")
                            insetsController.isAppearanceLightStatusBars = false
                            insetsController.isAppearanceLightNavigationBars = false
                            rootLayout?.setBackgroundColor(darkColor)
                            appBackground?.visibility = View.GONE
                            webView.setBackgroundColor(darkColor)
                            window.statusBarColor = darkColor
                            window.navigationBarColor = darkColor
                            window.decorView.setBackgroundColor(darkColor)
                        }
                        "light" -> {
                            val whiteColor = Color.parseColor("#ffffff")
                            insetsController.isAppearanceLightStatusBars = true
                            insetsController.isAppearanceLightNavigationBars = true
                            rootLayout?.setBackgroundColor(whiteColor)
                            appBackground?.visibility = View.GONE
                            webView.setBackgroundColor(whiteColor)
                            window.statusBarColor = whiteColor
                            window.navigationBarColor = whiteColor
                            window.decorView.setBackgroundColor(whiteColor)
                        }
                        else -> { // "sky" (default wallpaper background mode)
                            val skyColor = Color.parseColor("#38bdf8")
                            insetsController.isAppearanceLightStatusBars = false
                            insetsController.isAppearanceLightNavigationBars = false
                            rootLayout?.setBackgroundResource(R.drawable.splash_gradient)
                            appBackground?.visibility = View.VISIBLE
                            webView.setBackgroundColor(Color.TRANSPARENT)
                            window.statusBarColor = skyColor
                            window.navigationBarColor = skyColor
                            window.decorView.setBackgroundColor(skyColor)
                        }
                    }
                } catch (e: Exception) {
                    Log.e(logTag, "applyTheme failed", e)
                }
            }
        }

        webView.addJavascriptInterface(WebAppInterface(), "Android")

        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
                val msg = "${consoleMessage.message()} (line ${consoleMessage.lineNumber()} of ${consoleMessage.sourceId()})"
                when (consoleMessage.messageLevel()) {
                    ConsoleMessage.MessageLevel.ERROR -> Log.e(logTag, msg)
                    ConsoleMessage.MessageLevel.WARNING -> Log.w(logTag, msg)
                    else -> Log.d(logTag, msg)
                }
                return true
            }
        }

        webView.webViewClient = object : WebViewClient() {
            override fun onRenderProcessGone(view: WebView?, detail: RenderProcessGoneDetail?): Boolean {
                val didCrash = detail?.didCrash() ?: false
                val rendererPriority = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) detail?.rendererPriorityAtExit() else -1
                Log.e(logTag, "WebView onRenderProcessGone caught: didCrash=$didCrash, priority=$rendererPriority")
                try {
                    view?.let {
                        (it.parent as? ViewGroup)?.removeView(it)
                        it.destroy()
                    }
                } catch (_: Exception) {}
                recreate()
                return true
            }

            override fun onPageCommitVisible(view: WebView?, url: String?) {
                super.onPageCommitVisible(view, url)
                dismissSplash()
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                dismissSplash()
            }

            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val url = request.url.toString()
                if (url.startsWith("https://whatsapp.com/") || url.startsWith("https://wa.me/") || url.startsWith("whatsapp://")) {
                    return try {
                        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                        true
                    } catch (e: Exception) {
                        Log.e(logTag, "Failed to open external url=$url", e)
                        view.loadUrl(url)
                        true
                    }
                }

                view.loadUrl(url)
                return true
            }

            override fun onReceivedError(
                view: WebView,
                request: WebResourceRequest,
                error: WebResourceError
            ) {
                Log.e(logTag, "onReceivedError: ${error.errorCode} ${error.description} url=${request.url}")
                super.onReceivedError(view, request, error)
            }

            override fun onReceivedHttpError(
                view: WebView,
                request: WebResourceRequest,
                errorResponse: WebResourceResponse
            ) {
                Log.e(logTag, "onReceivedHttpError: ${errorResponse.statusCode} ${errorResponse.reasonPhrase} url=${request.url}")
                super.onReceivedHttpError(view, request, errorResponse)
            }
        }

        val startUrl = "file:///android_asset/www/index.html"
        webView.loadUrl(startUrl)

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                webView.evaluateJavascript(
                    """
                    (function() {
                        if (typeof window.handleNativeBackPressed === 'function') {
                            return window.handleNativeBackPressed();
                        } else if (typeof window.showExitPopupFromNative === 'function') {
                            window.showExitPopupFromNative();
                            return true;
                        }
                        return false;
                    })()
                    """.trimIndent(),
                    null
                )
            }
        })
    }

    private fun onSplashDismissed() {
        isSplashFinished = true
        if (appOpenAd != null && !hasShownInitialAppOpen) {
            showAppOpenAd()
        } else if (!hasShownInitialAppOpen) {
            pendingShowAppOpen = true
            loadAppOpenAd()
            mainHandler.postDelayed({
                pendingShowAppOpen = false
            }, 8000L)
        }
    }

    private fun showAdLoadingOverlay(message: String) {
        runOnUiThread {
            try {
                findViewById<TextView>(R.id.adLoadingText)?.text = message
                findViewById<View>(R.id.adLoadingOverlay)?.visibility = View.VISIBLE
            } catch (e: Exception) {
                Log.e(logTag, "showAdLoadingOverlay error", e)
            }
        }
    }

    private fun hideAdLoadingOverlay() {
        runOnUiThread {
            try {
                findViewById<View>(R.id.adLoadingOverlay)?.visibility = View.GONE
            } catch (e: Exception) {
                Log.e(logTag, "hideAdLoadingOverlay error", e)
            }
        }
    }

    // --- 1. App Open Ad (Google AdMob) ---
    private fun loadAppOpenAd() {
        if (appOpenAd != null || isAppOpenLoading || hasShownInitialAppOpen) return
        isAppOpenLoading = true
        val request = AdRequest.Builder().build()
        AppOpenAd.load(
            this,
            AD_UNIT_APP_OPEN,
            request,
            object : AppOpenAd.AppOpenAdLoadCallback() {
                override fun onAdLoaded(ad: AppOpenAd) {
                    Log.d(logTag, "AdMob AppOpenAd loaded successfully")
                    appOpenAd = ad
                    isAppOpenLoading = false
                    appOpenRetryCount = 0
                    if (isSplashFinished && !hasShownInitialAppOpen && pendingShowAppOpen) {
                        pendingShowAppOpen = false
                        showAppOpenAd()
                    }
                }
                override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                    Log.d(logTag, "AdMob AppOpenAd response: ${loadAdError.code} - ${loadAdError.message}")
                    appOpenAd = null
                    isAppOpenLoading = false
                    if (!hasShownInitialAppOpen && pendingShowAppOpen && appOpenRetryCount < 3) {
                        appOpenRetryCount++
                        mainHandler.postDelayed({ loadAppOpenAd() }, 1500L)
                    }
                }
            }
        )
    }

    private fun showAppOpenAd() {
        if (hasShownInitialAppOpen || isShowingFullScreenAd || isFinishing || isDestroyed) return
        val ad = appOpenAd ?: return
        hasShownInitialAppOpen = true
        isShowingFullScreenAd = true
        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                Log.d(logTag, "AdMob AppOpenAd dismissed")
                appOpenAd = null
                isShowingFullScreenAd = false
                mainHandler.postDelayed({ loadInterstitialAd() }, 500L)
            }
            override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                Log.w(logTag, "AdMob AppOpenAd failed to show: ${adError.message}")
                appOpenAd = null
                isShowingFullScreenAd = false
                mainHandler.postDelayed({ loadInterstitialAd() }, 500L)
            }
        }
        ad.show(this)
    }

    // --- 2. Interstitial Ad (Google AdMob) ---
    private fun loadInterstitialAd() {
        if (interstitialAd != null || isInterstitialLoading) return
        isInterstitialLoading = true
        val request = AdRequest.Builder().build()
        InterstitialAd.load(
            this,
            AD_UNIT_INTERSTITIAL,
            request,
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) {
                    Log.d(logTag, "AdMob InterstitialAd loaded successfully")
                    interstitialAd = ad
                    isInterstitialLoading = false
                    interstitialRetryCount = 0
                    val pendingKey = pendingInterstitialActionKey
                    if (pendingKey != null) {
                        interstitialTimeoutRunnable?.let { mainHandler.removeCallbacks(it) }
                        hideAdLoadingOverlay()
                        pendingInterstitialActionKey = null
                        displayLoadedInterstitial(ad, pendingKey)
                    }
                }
                override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                    Log.d(logTag, "AdMob InterstitialAd response: ${loadAdError.code} ${loadAdError.message}")
                    interstitialAd = null
                    isInterstitialLoading = false
                    val pendingKey = pendingInterstitialActionKey
                    if (pendingKey != null && interstitialRetryCount < 2) {
                        interstitialRetryCount++
                        mainHandler.postDelayed({ loadInterstitialAd() }, 800L)
                        return
                    }
                    if (pendingKey != null) {
                        interstitialTimeoutRunnable?.let { mainHandler.removeCallbacks(it) }
                        hideAdLoadingOverlay()
                        pendingInterstitialActionKey = null
                        interstitialRetryCount = 0
                        notifyInterstitialDismissedToWeb(pendingKey)
                    }
                    // Background retry for next click
                    mainHandler.postDelayed({ loadInterstitialAd() }, 4000L)
                }
            }
        )
    }

    private fun showInterstitialAd(actionKey: String?) {
        if (isFinishing || isDestroyed) {
            notifyInterstitialDismissedToWeb(actionKey)
            return
        }

        val currentAd = interstitialAd
        if (currentAd != null) {
            displayLoadedInterstitial(currentAd, actionKey)
        } else {
            showAdLoadingOverlay("বিজ্ঞাপন লোড হচ্ছে...")
            pendingInterstitialActionKey = actionKey

            interstitialTimeoutRunnable?.let { mainHandler.removeCallbacks(it) }
            val timeout = Runnable {
                hideAdLoadingOverlay()
                val key = pendingInterstitialActionKey
                pendingInterstitialActionKey = null
                notifyInterstitialDismissedToWeb(key)
                loadInterstitialAd()
            }
            interstitialTimeoutRunnable = timeout
            mainHandler.postDelayed(timeout, 5500L)

            isInterstitialLoading = false
            loadInterstitialAd()
        }
    }

    private fun displayLoadedInterstitial(ad: InterstitialAd, actionKey: String?) {
        isShowingFullScreenAd = true
        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                Log.d(logTag, "AdMob InterstitialAd dismissed")
                interstitialAd = null
                isShowingFullScreenAd = false
                mainHandler.postDelayed({ loadInterstitialAd() }, 600L)
                notifyInterstitialDismissedToWeb(actionKey)
            }
            override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                Log.w(logTag, "AdMob InterstitialAd failed to show: ${adError.message}")
                interstitialAd = null
                isShowingFullScreenAd = false
                mainHandler.postDelayed({ loadInterstitialAd() }, 600L)
                notifyInterstitialDismissedToWeb(actionKey)
            }
        }
        ad.show(this)
    }

    // --- 3. Rewarded Ad (Google AdMob) ---
    private fun loadRewardedAd() {
        if (rewardedAd != null || isRewardedLoading) return
        isRewardedLoading = true
        val request = AdRequest.Builder().build()
        RewardedAd.load(
            this,
            AD_UNIT_REWARDED,
            request,
            object : RewardedAdLoadCallback() {
                override fun onAdLoaded(ad: RewardedAd) {
                    Log.d(logTag, "AdMob RewardedAd loaded successfully")
                    rewardedAd = ad
                    isRewardedLoading = false
                    rewardedRetryCount = 0
                    val pendingKey = pendingRewardedActionKey
                    if (pendingKey != null) {
                        rewardedTimeoutRunnable?.let { mainHandler.removeCallbacks(it) }
                        hideAdLoadingOverlay()
                        pendingRewardedActionKey = null
                        displayLoadedRewarded(ad, pendingKey)
                    }
                }
                override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                    Log.d(logTag, "AdMob RewardedAd response: ${loadAdError.code} ${loadAdError.message}")
                    rewardedAd = null
                    isRewardedLoading = false
                    val pendingKey = pendingRewardedActionKey
                    if (pendingKey != null && rewardedRetryCount < 2) {
                        rewardedRetryCount++
                        mainHandler.postDelayed({ loadRewardedAd() }, 800L)
                        return
                    }
                    if (pendingKey != null) {
                        rewardedTimeoutRunnable?.let { mainHandler.removeCallbacks(it) }
                        hideAdLoadingOverlay()
                        pendingRewardedActionKey = null
                        rewardedRetryCount = 0
                        notifyRewardedDismissedToWeb(pendingKey, true)
                    }
                    mainHandler.postDelayed({ loadRewardedAd() }, 4000L)
                }
            }
        )
    }

    private fun showRewardedAd(actionKey: String?) {
        if (isFinishing || isDestroyed) {
            notifyRewardedDismissedToWeb(actionKey, true)
            return
        }

        val currentAd = rewardedAd
        if (currentAd != null) {
            displayLoadedRewarded(currentAd, actionKey)
        } else {
            showAdLoadingOverlay("রিওয়ার্ডেড বিজ্ঞাপন লোড হচ্ছে...")
            pendingRewardedActionKey = actionKey

            rewardedTimeoutRunnable?.let { mainHandler.removeCallbacks(it) }
            val timeout = Runnable {
                hideAdLoadingOverlay()
                val key = pendingRewardedActionKey
                pendingRewardedActionKey = null
                notifyRewardedDismissedToWeb(key, true)
                loadRewardedAd()
            }
            rewardedTimeoutRunnable = timeout
            mainHandler.postDelayed(timeout, 6000L)

            isRewardedLoading = false
            loadRewardedAd()
        }
    }

    private fun displayLoadedRewarded(ad: RewardedAd, actionKey: String?) {
        isShowingFullScreenAd = true
        var earnedReward = false
        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                Log.d(logTag, "AdMob RewardedAd dismissed, earnedReward=$earnedReward")
                rewardedAd = null
                isShowingFullScreenAd = false
                loadRewardedAd()
                notifyRewardedDismissedToWeb(actionKey, earnedReward)
            }
            override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                Log.w(logTag, "AdMob RewardedAd failed to show: ${adError.message}")
                rewardedAd = null
                isShowingFullScreenAd = false
                loadRewardedAd()
                notifyRewardedDismissedToWeb(actionKey, true)
            }
        }
        ad.show(this) { _ ->
            earnedReward = true
        }
    }

    private fun setupBannerAd() {
        try {
            val container = findViewById<FrameLayout>(R.id.bannerContainer) ?: return
            val adView = AdView(this)
            adView.adUnitId = AD_UNIT_BANNER
            adView.setAdSize(AdSize.BANNER)
            container.addView(adView)
            bannerAdView = adView
            val request = AdRequest.Builder().build()
            adView.loadAd(request)
        } catch (e: Exception) {
            Log.e(logTag, "setupBannerAd error", e)
        }
    }

    private fun setBannerAdVisible(show: Boolean) {
        isBannerVisible = show
        val container = findViewById<FrameLayout>(R.id.bannerContainer) ?: return
        val lp = webView.layoutParams as? ViewGroup.MarginLayoutParams
        val containerLp = container.layoutParams as? ViewGroup.MarginLayoutParams
        if (show) {
            container.visibility = View.VISIBLE
            containerLp?.bottomMargin = currentBottomInset
            container.layoutParams = containerLp
            val bannerHeightPx = (54 * resources.displayMetrics.density).toInt()
            lp?.bottomMargin = currentBottomInset + bannerHeightPx
            webView.layoutParams = lp
            bannerAdView?.resume()
        } else {
            container.visibility = View.GONE
            containerLp?.bottomMargin = currentBottomInset
            container.layoutParams = containerLp
            lp?.bottomMargin = currentBottomInset
            webView.layoutParams = lp
            bannerAdView?.pause()
        }
    }

    private fun notifyInterstitialDismissedToWeb(actionKey: String?) {
        val keyJs = if (actionKey == null) "null" else JSONObject.quote(actionKey)
        webView.post {
            webView.evaluateJavascript(
                "window.onInterstitialDismissedFromNative && window.onInterstitialDismissedFromNative($keyJs)",
                null
            )
        }
    }

    private fun notifyRewardedDismissedToWeb(actionKey: String?, rewardEarned: Boolean) {
        val keyJs = if (actionKey == null) "null" else JSONObject.quote(actionKey)
        webView.post {
            webView.evaluateJavascript(
                "window.onRewardedAdDismissedFromNative && window.onRewardedAdDismissedFromNative($keyJs, $rewardEarned)",
                null
            )
        }
    }

    override fun onDestroy() {
        bannerAdView?.destroy()
        (webView.parent as? ViewGroup)?.removeView(webView)
        webView.removeAllViews()
        webView.destroy()
        super.onDestroy()
    }
}
