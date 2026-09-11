package com.gyansohayota.class7guide

import android.animation.ObjectAnimator
import android.animation.ValueAnimator
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.view.animation.AccelerateDecelerateInterpolator
import android.view.animation.DecelerateInterpolator
import android.view.animation.OvershootInterpolator
import android.webkit.ConsoleMessage
import android.webkit.JavascriptInterface
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
import androidx.activity.enableEdgeToEdge
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.bumptech.glide.Glide
import org.json.JSONObject

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private val logTag = "WebView"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        val splashOverlay = findViewById<View>(R.id.splashOverlay)
        val overlayLogo = findViewById<ImageView>(R.id.overlayLogo)
        val logoContainer = findViewById<View>(R.id.logoContainer)
        val logoCard = findViewById<View>(R.id.logoCard)
        val pulseRing = findViewById<View>(R.id.pulseRing)
        val splashBadge = findViewById<View>(R.id.splashBadge)
        val splashTitle = findViewById<View>(R.id.splashTitle)
        val splashSubtitle = findViewById<View>(R.id.splashSubtitle)
        val splashTagline = findViewById<View>(R.id.splashTagline)
        val splashBottomGroup = findViewById<View>(R.id.splashBottomGroup)
        val bgOrbTop = findViewById<View>(R.id.bgOrbTop)
        val bgOrbBottom = findViewById<View>(R.id.bgOrbBottom)

        // Set webview background to match theme gradient top (#f0f9ff)
        webView.setBackgroundColor(Color.parseColor("#f0f9ff"))

        try {
            Glide.with(this)
                .asGif()
                .load("file:///android_asset/Image/sticker/logo.gif")
                .into(overlayLogo)
        } catch (_: Exception) {}

        // Set initial states for entrance animation
        logoContainer?.apply {
            scaleX = 0.45f
            scaleY = 0.45f
            alpha = 0f
        }
        splashBadge?.apply {
            translationY = -24f
            alpha = 0f
        }
        splashTitle?.apply {
            translationY = 32f
            alpha = 0f
        }
        splashSubtitle?.apply {
            translationY = 24f
            alpha = 0f
        }
        splashTagline?.alpha = 0f
        splashBottomGroup?.alpha = 0f

        // Run Entrance Sequence
        logoContainer?.animate()
            ?.scaleX(1f)
            ?.scaleY(1f)
            ?.alpha(1f)
            ?.setDuration(700L)
            ?.setInterpolator(OvershootInterpolator(1.35f))
            ?.start()

        splashBadge?.animate()
            ?.translationY(0f)
            ?.alpha(1f)
            ?.setStartDelay(250L)
            ?.setDuration(500L)
            ?.setInterpolator(DecelerateInterpolator())
            ?.start()

        splashTitle?.animate()
            ?.translationY(0f)
            ?.alpha(1f)
            ?.setStartDelay(350L)
            ?.setDuration(550L)
            ?.setInterpolator(DecelerateInterpolator())
            ?.start()

        splashSubtitle?.animate()
            ?.translationY(0f)
            ?.alpha(1f)
            ?.setStartDelay(450L)
            ?.setDuration(500L)
            ?.setInterpolator(DecelerateInterpolator())
            ?.start()

        splashTagline?.animate()
            ?.alpha(0.85f)
            ?.setStartDelay(550L)
            ?.setDuration(500L)
            ?.start()

        splashBottomGroup?.animate()
            ?.alpha(1f)
            ?.setStartDelay(650L)
            ?.setDuration(550L)
            ?.start()

        // Continuous subtle floating & pulsing animations
        val floatAnim = ObjectAnimator.ofFloat(logoCard, "translationY", -7f, 7f).apply {
            duration = 1400L
            repeatMode = ValueAnimator.REVERSE
            repeatCount = ValueAnimator.INFINITE
            interpolator = AccelerateDecelerateInterpolator()
            start()
        }

        val pulseRingScaleX = ObjectAnimator.ofFloat(pulseRing, "scaleX", 1f, 1.15f).apply {
            duration = 1200L
            repeatMode = ValueAnimator.REVERSE
            repeatCount = ValueAnimator.INFINITE
            interpolator = AccelerateDecelerateInterpolator()
            start()
        }
        val pulseRingScaleY = ObjectAnimator.ofFloat(pulseRing, "scaleY", 1f, 1.15f).apply {
            duration = 1200L
            repeatMode = ValueAnimator.REVERSE
            repeatCount = ValueAnimator.INFINITE
            interpolator = AccelerateDecelerateInterpolator()
            start()
        }
        val pulseRingAlpha = ObjectAnimator.ofFloat(pulseRing, "alpha", 0.75f, 0.25f).apply {
            duration = 1200L
            repeatMode = ValueAnimator.REVERSE
            repeatCount = ValueAnimator.INFINITE
            interpolator = AccelerateDecelerateInterpolator()
            start()
        }

        val orbTopAnim = ObjectAnimator.ofFloat(bgOrbTop, "scaleX", 1f, 1.12f).apply {
            duration = 2600L
            repeatMode = ValueAnimator.REVERSE
            repeatCount = ValueAnimator.INFINITE
            start()
        }
        val orbTopYAnim = ObjectAnimator.ofFloat(bgOrbTop, "scaleY", 1f, 1.12f).apply {
            duration = 2600L
            repeatMode = ValueAnimator.REVERSE
            repeatCount = ValueAnimator.INFINITE
            start()
        }

        val splashStartTime = System.currentTimeMillis()
        val minSplashDurationMs = 1800L
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
                        .scaleX(1.06f)
                        .scaleY(1.06f)
                        .setDuration(420L)
                        .setInterpolator(DecelerateInterpolator())
                        .withEndAction {
                            splashOverlay.visibility = View.GONE
                            try {
                                floatAnim.cancel()
                                pulseRingScaleX.cancel()
                                pulseRingScaleY.cancel()
                                pulseRingAlpha.cancel()
                                orbTopAnim.cancel()
                                orbTopYAnim.cancel()
                            } catch (_: Exception) {}
                        }
                        .start()
                }
            }, remaining)
        }

        // Safety fallback so splash is never stuck
        splashOverlay.postDelayed({ dismissSplash() }, 3200L)

        val root = findViewById<View>(R.id.rootLayout)
        ViewCompat.setOnApplyWindowInsetsListener(root) { view, insets ->
            val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            val lp = webView.layoutParams as? ViewGroup.MarginLayoutParams
            if (lp != null) {
                lp.topMargin = bars.top
                lp.bottomMargin = bars.bottom
                lp.leftMargin = bars.left
                lp.rightMargin = bars.right
                webView.layoutParams = lp
            }
            splashBottomGroup?.setPadding(
                splashBottomGroup.paddingLeft,
                splashBottomGroup.paddingTop,
                splashBottomGroup.paddingRight,
                bars.bottom + 20
            )
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
                    notifyInterstitialDismissedToWeb(actionKey)
                }
            }

            @JavascriptInterface
            fun triggerInterstitialAd() {
                runOnUiThread {
                    notifyInterstitialDismissedToWeb(null)
                }
            }

            @JavascriptInterface
            fun exitApp() {
                runOnUiThread { finish() }
            }

            @JavascriptInterface
            fun downloadPdf(chapterId: String, downloadUrl: String, callbackJs: String) {
                Thread {
                    try {
                        val cacheDir = java.io.File(cacheDir, "pdf_cache")
                        if (!cacheDir.exists()) cacheDir.mkdirs()
                        val pdfFile = java.io.File(cacheDir, "$chapterId.pdf")

                        if (!pdfFile.exists() || pdfFile.length() < 1000) {
                            var targetUrl = downloadUrl
                            var redirects = 0
                            while (redirects < 6) {
                                val url = java.net.URL(targetUrl)
                                val conn = url.openConnection() as java.net.HttpURLConnection
                                conn.setRequestProperty("User-Agent", "Mozilla/5.0")
                                conn.connectTimeout = 15000
                                conn.readTimeout = 30000
                                conn.instanceFollowRedirects = false
                                val code = conn.responseCode
                                if (code in 300..399) {
                                    val loc = conn.getHeaderField("Location")
                                    if (loc != null) {
                                        targetUrl = if (loc.startsWith("http")) loc else java.net.URL(url, loc).toString()
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

                                val tempFile = java.io.File(cacheDir, "$chapterId.tmp")
                                var bytesRead = 0L
                                var lastUpdate = 0L
                                val buffer = ByteArray(16384)

                                conn.inputStream.use { input ->
                                    java.io.FileOutputStream(tempFile).use { output ->
                                        var read: Int
                                        while (input.read(buffer).also { read = it } != -1) {
                                            output.write(buffer, 0, read)
                                            bytesRead += read
                                            val now = System.currentTimeMillis()
                                            if (now - lastUpdate > 80) {
                                                lastUpdate = now
                                                val percent = if (totalLength > 0) ((bytesRead * 100) / totalLength).toInt().coerceIn(1, 99) else 50
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

                                if (tempFile.exists() && tempFile.length() > 1000) {
                                    if (pdfFile.exists()) pdfFile.delete()
                                    tempFile.renameTo(pdfFile)
                                }
                                break
                            }
                        }

                        runOnUiThread {
                            val js100 = """
                                (function() {
                                    if (window.__onDownloadProgress) window.__onDownloadProgress(100, '', '');
                                    var iframes = document.querySelectorAll('iframe');
                                    for (var i = 0; i < iframes.length; i++) {
                                        try {
                                            if (iframes[i].contentWindow && iframes[i].contentWindow.__onDownloadProgress) {
                                                iframes[i].contentWindow.__onDownloadProgress(100, '', '');
                                            }
                                        } catch(e) {}
                                    }
                                })();
                            """.trimIndent()
                            webView.evaluateJavascript(js100, null)
                        }

                        val fileUri = "file://${pdfFile.absolutePath}"
                        runOnUiThread {
                            val jsCallback = """
                                (function() {
                                    try { eval("$callbackJs('$fileUri')"); } catch(e) {}
                                    var iframes = document.querySelectorAll('iframe');
                                    for (var i = 0; i < iframes.length; i++) {
                                        try {
                                            if (iframes[i].contentWindow) {
                                                iframes[i].contentWindow.eval("$callbackJs('$fileUri')");
                                            }
                                        } catch(e) {}
                                    }
                                })();
                            """.trimIndent()
                            webView.evaluateJavascript(jsCallback, null)
                        }
                    } catch (e: Exception) {
                        Log.e(logTag, "downloadPdf failed for $chapterId", e)
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
                    if (pdfFile.exists() && pdfFile.length() > 0) {
                        val bytes = pdfFile.readBytes()
                        android.util.Base64.encodeToString(bytes, android.util.Base64.NO_WRAP)
                    } else null
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
                    pdfFile.exists() && pdfFile.length() > 1000
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
                if (webView.canGoBack()) {
                    webView.goBack()
                    return
                }

                webView.evaluateJavascript(
                    "window.showExitPopupFromNative && window.showExitPopupFromNative()",
                    null
                )
            }
        })
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

    override fun onDestroy() {
        (webView.parent as? ViewGroup)?.removeView(webView)
        webView.removeAllViews()
        webView.destroy()
        super.onDestroy()
    }
}
