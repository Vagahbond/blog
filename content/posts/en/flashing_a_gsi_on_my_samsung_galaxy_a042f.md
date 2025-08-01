---
date: '2024-05-17T17:22:56+10:00'
draft: false
title: 'Flashing a GSI on my Samsung Galaxy a042f'
tldr: 'A technical guide at flashing a GSI on a shitty phone.'
---


Or theorically any other Galaxy device supporting Treble Project.

Pre-required:

- A bit of computer literacy
- Little knowledge in Android modding
- A Windows installation (unfortunately)
- Unlocked bootloader (you will find some tutorial for your device somewhere)

## Introduction

This article describes my painful path while trying to mod a stupid cheap phone I bought as an emergency when my dear OnePlus 9 broke and I could not afford to buy a good one right away.

I found out the hard way that even though there is little to no *human written* documentation on the internet about modding this phone, it's still possible.

My aim there is to direct you to resources, and make the hard way easier to understand.

**DISCLAIMER: some features might not work on a GSI, especially related to network and more especially if you're using a Mediatek chip.**

This device is really slow and weak and I feel like Samsung's overlay really weights on the components, so my aim is initially to install anything lighter to make it run smoother.

However, there are a few issues.

## No recovery

It appears that Samsung Galaxy devices use a proprietary program instead of [fastboot](https://www.androidcentral.com/android-z-what-fastboot) called [Loke](https://www.xda-developers.com/how-to-install-custom-roms-or-gsis-on-samsung-galaxy-devices-without-twrp/).

To communicate with Loke, one must use Samsung's own (leaked) software, [Odin](https://www.odinflash.com/).
As always, there is an open source alternative made to replace Odin. It's called [Heimdall](https://glassechidna.com.au/heimdall/), but the project seems pretty much inactive.

You can use the [Download mode](https://www.thecustomdroid.com/samsung-galaxy-download-odin-mode-guide/) on your phone to enable it to communicate via the Odin protocol.

This way, you can use either Odin or Heimdall to sideload firmware into it.

On the other hand, there probably is no developer on earth working on this phone because it's cheap and crappy, with way better options at its price range.
Hence, there are no TWRP versions available for this model.

Fortunately, it's possible to flash the ROM directly using Download mode and Odin.

## No custom ROM

For the aforementioned reason, there is not a single custom ROM build existing for this device, and there might not even be modder using it.

Hope is not lost however, as there happens to be something called [project treble](https://android-developers.googleblog.com/2020/12/treble-plus-one-equals-four.html). This project initiated by google allows manufacturers to separate their OTA system updates from the hardware-related layers of software. This way, they do not have to adapt their firmware for every and each one of their devices, which allows to save a whole lot of time. it also means they don't have to wait for chip manufacturer's updates or embed it in their updates before releasing them. (Note that in practice the treble project did not so great at improving updates cycles release times).

This must have been a good news for custom ROM developers too, as it means now their ROM can be run on virtually any treble-enabled phone, as long as treble was correctly implemented.

So how does it work ?

[GSI](https://developer.android.com/topic/generic-system-image/) (Generic System Image) is the name of the flash-able package that you can side-load to a Treble enabled device.

Those GSIs are built off custom ROM sources, and consist in a vanilla system.

Usually, the flash done using fastboot or a custom recovery. But remember: with my device, there is no fastboot, and there is no recovery. Only pain.

So the only way to go is side-loading it via Samsung's Loke protocol on download mode.

This protocol is not *That* different from fastboot. The big difference is that components of the system are side-loaded as LZ4 compressed archives. Fortunately, this algorithm is easy to use thanks to [an open source repo](https://github.com/lz4/lz4) on GitHub.

As we're trying to flash a GSI, it means we're only trying to change part of the system. Every piece of software that is related to the hardware management is going to have to stay the same.

You're going to need to fetch that part of the software too.

For finding your GSI, there is [this site](https://github.com/phhusson/treble_experimentations/wiki/Generic-System-Image-%28GSI%29-list). I will personnaly use [ElixirOS](https://projectelixiros.com/home).

You also need to download the official firmware for your device using [this](https://samfw.com/).
Make sure it's the right version of your software, the right build version compared to what was already on your device, and that it's the good CSC for your phone's region.

The following is essentially the application of [this guide](https://xdaforums.com/t/guide-custom-how-to-install-custom-rom-using-odin-without-twrp-phh-lineageos.4114435/). I am going to describe every steps a bit more because I found myself in a situation that it does not solve. Still, props to kkoo. The guy wrote that guide and the bat we'll use without expecting anything in return and it's still relevant 4 years later. I love this kind of communities.

### Step 0: Backup

**It could seem obvious to you but during this process you're sure to lose your data on your phone, so back it up before you do anything or you might regret it !**

### Step 1: Decompress

Once you have the stock firmware for your phone downloaded, it should have `.tar.md5.zip` as an extension and you can extract it using `unzip` or a similar tool.

You end up with a few different files, in my case those:

```
.
├── AP_A042FXXS2CWC3_A042FXXS2CWC3_MQB63678143_REV00_user_low_ship_MULTI_CERT_meta_OS13.tar.md5
├── BL_A042FXXS2CWC3_A042FXXS2CWC3_MQB63678143_REV00_user_low_ship_MULTI_CERT.tar.md5
├── CP_A042FXXS2CWC3_CP23977308_MQB63678143_REV00_user_low_ship_MULTI_CERT.tar.md5
├── CSC_OJM_A042FOJM2CWC3_QB63678336_REV00_user_low_ship_MULTI_CERT.tar.md5
└── HOME_CSC_OJM_A042FOJM2CWC3_QB63678336_REV00_user_low_ship_MULTI_CERT.tar.md5
```

What's interesting here for us is the `AP` one.

### Step 2: Decompress: the sequel

So we're going to take that `AP` file and decompress it using tar `tar xf AP_XXXXXXXXXXXX.tar.md5`.

The result should be along those lines:

```
.
├── boot.img.lz4
├── dtbo.img.lz4
├── recovery.img.lz4
├── scp-verified.img.lz4
├── spmfw-verified.img.lz4
├── sspm-verified.img.lz4
├── super.img.lz4
├── system.img.ext4.lz4
├── tee-verified.img.lz4
├── tzar.img.lz4
├── userdata.img.lz4
└── vbmeta.img.lz4
```

Depending on your phone, that may vary.

In this step, you might have no `super.img.lz4` file and in this case you'll have a `system.img.ext4.lz4`.

Do not panic, the system partition is actually supposed to be found in the `super` file.
If you have a `super` file, then congrats you can follow [the original guide off which this one is based](https://xdaforums.com/t/guide-custom-how-to-install-custom-rom-using-odin-without-twrp-phh-lineageos.4114435/) without further complications !

Otherwise, it's great you're here !

### Step 3: A clean vbmeta

We're going to use [the link provided in the tutorial](https://dl.google.com/developers/android/qt/images/gsi/vbmeta.img) to download a clean vbmeta

You'll get a `vbmeta.img` but remember: for Loke, you need lz4 compressed files. So now you'll need to either use the lz4 command or a windows lz4 executable to compress it.

```
❯ lz4 -B6 --content-size vbmeta.img vbmeta.img.lz4

using blocks of size 1024 KB
Compressed 4096 bytes into 2380 bytes ==> 58.11%

❯ tree
.
├── vbmeta.img
└── vbmeta.img.lz4

1 directory, 2 files
```

### Step 4: Prepping the GSI system image

We downloaded the GSI we want to use earlier. We have to prepare it.

First, we need to extract it. It's most likely in the `.xz` format. You'll need either 7zip or xz-utils (name depends on your distro).

```
❯ ls
 ProjectElixir_4.0_arm64_bgN-14.0-20240108-1305-OFFICIAL.img.xz

❯ xz -d ProjectElixir_4.0_arm64_bgN-14.0-20240108-1305-OFFICIAL.img.xz

❯ ls
ProjectElixir_4.0_arm64_bgN-14.0-20240108-1305-OFFICIAL.img
```

Our xz file is now extracted. Now we rename it to `system.img`.

```
❯ mv ProjectElixir_4.0_arm64_bgN-14.0-20240108-1305-OFFICIAL.img system.img

❯ ls
system.img
```

We have our GSI's system image prepped up for samsung's fastboot replacement, hurray !

Now is where it gets complicated : In the original tutorial, we'd just patch boot if we want a root, and re-bundle the whole thing, ready for a flash. However, in our case, `system.img` should be embedded in `super.img.lz4`.

We're going to have to open that `super.img.lz4`, change its system.img, and re-bundle it.

### Step 5: Patching super.img.lz4

So now we need to replace `system.img` with our file, in super.img.lz4. first, we need to extract it into `super.img`.

```
❯ cp step_2/super.img.lz4 step_5

❯ cd step_5

❯ lz4 -d super.img.lz4 super.img
super.img.lz4        : decoded 6298912536 bytes

❯ ls
super.img  super.img.lz4
```

Our lz4 compression is gone. We now have a .img file to open. modify, and repackage.

Techniques exist for doing that with ext4 system partitions, but ours is f2fs, which complicates things.

Fortunately, someone made a [convenient script](https://github.com/ChromiumOS-Guy/SuperPatcherGSI) for that. Thanks, Mr ChromiunOS-Guy!

You can download his release as an AppImage to use it.

It's going to ask for a couple parameters as described in the readme. Give it our `super.img` as input, and what you want as output. for instance, `super-patched.img`.

You might have to chmod +x some of the executables it uses (I had to do that on nix using `appimage-run`.

```
✗ appimage-run SuperPatcherGSI-x86_64.AppImage -i super.img -s 2 -o super-patched.img
SuperPatcherGSI-x86_64.AppImage installed in /home/vagahbond/.cache/appimage-run/204e7b658eb0c0f08029895252612dd1baa788edc86e6e5edc98573b805cde43
flags successfully verified and appear to be correct, error code (OK)
============================
        unpacking...
============================
Sparse image detected.
Process conversion to non sparse image ....[ok]
Extracting partition [system] .... [ok]
Extracting partition [odm] .... [ok]
Extracting partition [product] .... [ok]
Extracting partition [vendor] .... [ok]
============================
      img manipulation
============================
Chosse Operation:
1. Delete Partition
2. Replace Partition
3. Add Partition
select: 2
option number 0 odm.img size of (21389312) bytes
option number 1 vendor.img size of (698982400) bytes
option number 2 system.img size of (4142309376) bytes
option number 3 product.img size of (1485238272) bytes
Please Choose: 2
Please Input Path To Replacment Partition:
../step_4/system.img
Are you sure this is the path to file (Y/n): y
Partition Replaced!
Replace/Delete/Add another (Y/n): n
============================
device size (super.img size) in bytes must be evenly divisible by 512, default (6363017216) bytes:
metadata size in bytes must be evenly divisible by 512 default=~0.5KiB:
make sparse (flashable with fastboot) ? (Y/n): y
============================
    using these flags:
============================
 --device-size=6363017216 --metadata-slots=2 --output super-patched.img --metadata-size 512000 --sparse --partition=odm:none:21389312 --image=odm=/home/vagahbond/Projects/a042f/a042f/step_5/.temp/odm.img --partition=vendor:none:698982400 --image=vendor=/home/vagahbond/Projects/a042f/a042f/step_5/.temp/vendor.img --partition=system:none:4152287232 --image=system=/home/vagahbond/Projects/a042f/a042f/step_5/.temp/system.img --partition=product:none:1485238272 --image=product=/home/vagahbond/Projects/a042f/a042f/step_5/.temp/product.img
============================
02-18 03:11:37.865 1432053 1432053 I lpmake  : builder.cpp:1093 [liblp] Partition odm will resize from 0 bytes to 21389312 bytes
02-18 03:11:37.866 1432053 1432053 I lpmake  : builder.cpp:1093 [liblp] Partition vendor will resize from 0 bytes to 698982400 bytes
02-18 03:11:37.866 1432053 1432053 I lpmake  : builder.cpp:1093 [liblp] Partition system will resize from 0 bytes to 4152287232 bytes
02-18 03:11:37.866 1432053 1432053 I lpmake  : builder.cpp:1093 [liblp] Partition product will resize from 0 bytes to 1485238272 bytes
Invalid sparse file format at header magic
Invalid sparse file format at header magic
Invalid sparse file format at header magic
Invalid sparse file format at header magic
============================
        cleaning...
============================
OK
```

Hooray, we've got a patched `super.img` file !

One last step before repackaging is compressing it:

```
❯ lz4 -B6 --content-size super-patched.img super-patched.img.lz4
using blocks of size 1024 KB
Compressed 6203327840 bytes into 3889510987 bytes ==> 62.70%


❯ ls
super-patched.img  super-patched.img.lz4  super.img  super.img.lz4  super.unsparse.img  SuperPatcherGSI-x86_64.AppImage
```

Now, we've got to package it, and then flash it.

### Step 6: Gathering the files

To root your phone, you need to patch your boot partition using magisk which is a bit outside of what we're doing right now.
You can follow steps 14 to 24 of the [base guide](https://xdaforums.com/t/guide-custom-how-to-install-custom-rom-using-odin-without-twrp-phh-lineageos.4114435/) for that.

Once that's done (or not done) you can gather every file we have in a directory.

```
❯ cp ../step_5/super-patched.img.lz4 super.img.lz4

❯ cp ../step_2/recovery.img.lz4 ../step_2/spmfw-verified.img.lz4 ../step_2/dtbo.img.lz4 ../step_2/tzar.img.lz4 ../step_2/vbmeta_system.img.lz4 ../step_2/sspm-verified.img.lz4  ../step_2/scp-verified.img.lz4 ../step_2/tee-verified.img.lz4 ../step_2/userdata.img.lz4 ./

❯ cp ../patched_boot.img.lz4 ./boot.img.lz4

❯ cp ../step_3/vbmeta.img.lz4 ./

❯ ls
boot.img.lz4  
recovery.img.lz4      
spmfw-verified.img.lz4  
super.img.lz4         
tzar.img.lz4      
vbmeta.img.lz4
dtbo.img.lz4  
scp-verified.img.lz4  
sspm-verified.img.lz4   
tee-verified.img.lz4  
userdata.img.lz4  
vbmeta_system.img.lz4
```

### step 7: Repackaging AP

Everything is ready ! We just have to gather everything in a single AP flash-able file ! For that, we're going to use the bat script that was given to us in the base tutorial we're using !

[Download it there](https://xdaforums.com/attachments/tar-md5-script-tool-zip.5039569/).

Unzip the file and be ready: when you run the script, it's going to delete every file you gathered. I advise you to copy them in a new directory in case you'd need to goo back a couple steps.

```
❯ unzip tar-md5-script-tool.zip
Archive:  tar-md5-script-tool.zip
  inflating: batch.bat
   creating: bin/
  inflating: bin/cygattr-1.dll
  inflating: bin/cyggcc_s-1.dll
  inflating: bin/cygiconv-2.dll
  inflating: bin/cygintl-8.dll
  inflating: bin/cygwin1.dll
  inflating: bin/ls.exe
  inflating: bin/md5sum.exe
  inflating: bin/mv.exe
  inflating: bin/tar.exe
 extracting: Yes_File
```

That script is supposed to be ran on windows. If you're on windows, good for you. Otherwise, you can always have a VM use usb pass-through via qemu and KVM.

In my case, that is what I'm going to do.
You can always try to run the bat with wine but you're going to have to have that Windows anyways because reportedly this manipulation does not work using Heimdall instead of Odin in the end.

Once on your windows machine, just make sure batch.bat is in the same folder as the `.img.lz4` files, and run it. It'll take a while and you will end up with a folder called `temp-folder`. In this folder you should be able to find an AP package.

![The AP package](https://cloud.vagahbond.com/apps/files_sharing/publicpreview/NoJ6FobpTXqqH8D?file=/&fileId=5290&x=1860&y=1194&a=true&etag=4feddf61536afd71905f084680e5d0b3)

This package is what you will load into Odin for flashing on your phone.

What's left to do now is open odin (beware of the version, for me only 3.14 worked !), and load your baked `AP` package, along with `BL` and `CP` and as `CSC` the `HOME_CSC` file.

Then click start, Wait for a while, and prey.

![The Odin interface](https://cloud.vagahbond.com/apps/files_sharing/publicpreview/qoigsa2mkkgc9pj?file=/&fileId=5272&x=1860&y=1194&a=true&etag=7152a8775e9f389678164a046ff52f1a)

Ultimately, you might get a bootloop, or it might work depending on how the GSI you're using is made.

In my case Project Elixir did not work and all I got to experience was its sweet splash screen.

I ended up trying a pure AOSP build, and everything work except :

- Sending SMS (receiving works, idk what's going on)
- Data

Apparently Samsung devices with Samsung chips are really closed source and you cannot get an APK for the IMS, which is a piece of software allowing you to register to the network. I could not find anything on forums except "give up" advice. I believe there might be a way to grab that thing in the firmware package somehow but did not bother to try. Hit me up if you do !

Now enjoy that beautiful de-bloated screen showing up on you phone. Is that not beautiful ?

HURRAYYY!

## Lost ?

Maybe it's the first time you're doing this and you just entered the android modding world. In that case you might be wondering what other people use.

[Here is a curated list of what you can use when modding/ungoogling your phone](https://github.com/jbro129/android-modding).

[Here is a curated list known custom android roms that you could want to try](https://www.reddit.com/r/custom_rom/comments/17drli8/curated_list_of_custom_roms_for_android_devices/).

I highly recommend browsing the [XDA](https://xdaforums.com/f/android.613/) forums for information about whatever phone you use or whatever experiment you want to run.

Thanks for following this article, and keep on hacking ;)
