package com.gyansohayota.class7guide

import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.webkit.ConsoleMessage
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.JavascriptInterface
import androidx.activity.OnBackPressedCallback
import androidx.activity.ComponentActivity
import androidx.activity.enableEdgeToEdge
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import org.json.JSONObject

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private val logTag = "WebView"
    private var interstitialAd: InterstitialAd? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)

        val root = findViewById<View>(R.id.rootLayout)
        ViewCompat.setOnApplyWindowInsetsListener(root) { view, insets ->
            val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            view.setPadding(bars.left, bars.top, bars.right, bars.bottom)
            insets
        }

        val adView = findViewById<AdView>(R.id.adView)
        adView.loadAd(AdRequest.Builder().build())

        loadInterstitial()

        val isDebuggable = (applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE) != 0
        WebView.setWebContentsDebuggingEnabled(isDebuggable)

        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.allowFileAccess = true
        webView.settings.allowContentAccess = true
        webView.settings.allowFileAccessFromFileURLs = true
        webView.settings.allowUniversalAccessFromFileURLs = true
        webView.settings.mediaPlaybackRequiresUserGesture = false

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

            override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
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

        if (!isOnline()) {
            AlertDialog.Builder(this)
                .setTitle("Offline")
                .setMessage("আপনি বর্তমানে ইন্টারনেট সংযোগহীন। কিছু রিসোর্স (ফন্ট/স্ক্রিপ্ট) লোড নাও হতে পারে।")
                .setPositiveButton("OK", null)
                .show()
        }

        val hasBuiltWeb = assetExists("www/index.html")
        if (!hasBuiltWeb) {
            val html = """
                <!doctype html>
                <html lang=\"bn\">
                <head>
                  <meta charset=\"utf-8\" />
                  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
                  <title>Web app build missing</title>
                  <style>
                    body{font-family:sans-serif;margin:0;display:flex;min-height:100vh;align-items:center;justify-content:center;background:#f0f9ff;color:#0c4a6e}
                    .card{max-width:720px;margin:24px;padding:18px;border-radius:16px;background:#ffffff;box-shadow:0 10px 30px rgba(0,0,0,.12)}
                    h2{margin:0 0 12px 0}
                    code{background:#eef2ff;padding:2px 6px;border-radius:6px}
                    .btn{display:inline-block;margin-top:12px;padding:10px 14px;border-radius:10px;background:#0369a1;color:#fff;text-decoration:none}
                  </style>
                </head>
                <body>
                  <div class=\"card\">
                    <h2>Web app build missing</h2>
                    <div>React/Vite source (TSX) WebView সরাসরি চালাতে পারে না, তাই UI আসছে না।</div>
                    <div style=\"margin-top:10px\">Fix:</div>
                    <div style=\"margin-top:6px\">
                      1) <code>app/src/main/assets</code> ফোল্ডারে গিয়ে <code>npm install</code><br/>
                      2) তারপর <code>npm run build</code><br/>
                      3) তৈরি হওয়া <code>dist</code> ফোল্ডারের সব ফাইল কপি করে দিন: <code>app/src/main/assets/www/</code>
                    </div>
                    <a class=\"btn\" href=\"javascript:location.reload()\">Reload</a>
                  </div>
                </body>
                </html>
            """.trimIndent()
            webView.loadDataWithBaseURL(
                "file:///android_asset/",
                html,
                "text/html",
                "utf-8",
                null
            )
        } else {
            val startUrl = "file:///android_asset/www/index.html"
            Log.d(logTag, "Loading startUrl=$startUrl")
            webView.loadUrl(startUrl)
        }

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

    inner class WebAppInterface {
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
                showInterstitialAndNotify(actionKey)
            }
        }

        @JavascriptInterface
        fun triggerInterstitialAd() {
            runOnUiThread {
                showInterstitialAndNotify(null)
            }
        }

        @JavascriptInterface
        fun exitApp() {
            runOnUiThread { finish() }
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

    private fun showInterstitialAndNotify(actionKey: String?) {
        val ad = interstitialAd
        if (ad == null) {
            notifyInterstitialDismissedToWeb(actionKey)
            loadInterstitial()
            return
        }

        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                interstitialAd = null
                loadInterstitial()
                notifyInterstitialDismissedToWeb(actionKey)
            }

            override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                interstitialAd = null
                loadInterstitial()
                notifyInterstitialDismissedToWeb(actionKey)
            }
        }

        ad.show(this)
    }

    private fun isOnline(): Boolean {
        return try {
            val connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
            val network = connectivityManager.activeNetwork ?: return false
            val capabilities = connectivityManager.getNetworkCapabilities(network) ?: return false
            capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
        } catch (_: SecurityException) {
            false
        }
    }

    private fun assetExists(path: String): Boolean {
        return try {
            assets.open(path).close()
            true
        } catch (_: Exception) {
            false
        }
    }

    private fun loadInterstitial() {
        InterstitialAd.load(
            this,
            "ca-app-pub-1085315222792737/9882116336",
            AdRequest.Builder().build(),
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) {
                    interstitialAd = ad
                }

                override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                    interstitialAd = null
                }
            }
        )
    }

    override fun onDestroy() {
        (webView.parent as? ViewGroup)?.removeView(webView)
        webView.removeAllViews()
        webView.destroy()
        super.onDestroy()
    }
}
