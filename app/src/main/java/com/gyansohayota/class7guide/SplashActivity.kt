package com.gyansohayota.class7guide

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.ImageView
import androidx.activity.ComponentActivity
import androidx.activity.enableEdgeToEdge
import com.bumptech.glide.Glide
import com.google.android.gms.ads.MobileAds

class SplashActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_splash)

        MobileAds.initialize(this)

        val gifImageView = findViewById<ImageView>(R.id.gifImageView)
        Glide.with(this)
            .asGif()
            .load("file:///android_asset/Image/sticker/logo.gif")
            .into(gifImageView)

        Handler(Looper.getMainLooper()).postDelayed({
            startActivity(Intent(this, MainActivity::class.java))
            finish()
        }, 1500L)
    }
}
