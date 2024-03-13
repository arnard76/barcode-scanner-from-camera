<script lang="ts">
  import BarcodeReader from "$lib/BarcodeReader.svelte";
  import beeper from "$lib/beeper";
  let barcode: string | null = null;

  const handleBarcode = (data: any) => {
    if (barcode != data.text) (beeper as HTMLAudioElement).play();

    barcode = data.text;
  };
</script>

<BarcodeReader onScan={handleBarcode} />
<p>{barcode}</p>
