<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { BrowserMultiFormatReader, BarcodeFormat } from "@zxing/library";
  import type { BarcodeEvent } from "svelte-barcode-kit";
  import { browser } from "$app/environment";

  export let onScan: (event: BarcodeEvent) => void;

  const codeReader = new BrowserMultiFormatReader();

  let videoElement: HTMLVideoElement;
  let devices: any[] = [];
  let selectedDeviceId: null | string;

  $: videoSource = selectedDeviceId
    ? devices.find((device) => device.deviceId === selectedDeviceId)
    : null;

  $: videoSource && scan();

  browser &&
    "navigator" in window &&
    window.navigator.mediaDevices.enumerateDevices().then((res) => {
      devices = res.filter((device) => device.kind === "videoinput");
      devices.length && (selectedDeviceId = devices[0].deviceId);
    });

  $: console.log({ selectedDeviceId, videoSource });

  async function scan() {
    if (!videoSource) return;

    codeReader.reset();

    await codeReader.decodeFromVideoDevice(
      videoSource.deviceId,
      videoElement,
      (result) => {
        if (result) {
          const event = {
            text: result.getText(),
            format: BarcodeFormat[result.getBarcodeFormat()],
            timestamp: result.getTimestamp(),
          };
          onScan(event);
        }
      }
    );
  }

  function stopStreamOnVideoElement() {
    if (!videoElement) return;
    const stream = videoElement.srcObject as MediaStream;
    console.log("stoppping stream", { stream });
    const tracks = stream?.getTracks();
    if (!tracks) return;

    tracks.forEach((track) => {
      track.stop();
    });

    videoElement.srcObject = null;
  }

  onDestroy(() => codeReader.reset());
</script>

<video
  bind:this={videoElement}
  controls={false}
  autoPlay={true}
  muted={true}
  playsInline={true}
  disablePictureInPicture={true}
  class={$$props.class}
  style={$$props.style}
  width={$$props.width}
  height={$$props.height}
/>

{#if devices}
  <select bind:value={selectedDeviceId}>
    {#each devices as device (device.deviceId)}
      <option value={device.deviceId}>{device.label}</option>
    {/each}
  </select>
{:else}
  <p>no devices</p>
{/if}

<style>
  video {
    transform: rotateY(180deg);
  }
</style>
