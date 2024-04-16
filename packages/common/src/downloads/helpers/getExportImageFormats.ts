import { IDynamicDownloadFormat } from "./types";

export function getExportImageDownloadFormats(): IDynamicDownloadFormat[] {
  const formats: IDynamicDownloadFormat[] = [
    { type: "dynamic", format: "jpgpng" },
    { type: "dynamic", format: "png" },
    { type: "dynamic", format: "png8" },
    { type: "dynamic", format: "png24" },
    { type: "dynamic", format: "jpg" },
    { type: "dynamic", format: "bmp" },
    { type: "dynamic", format: "gif" },
    { type: "dynamic", format: "tiff" },
    { type: "dynamic", format: "png32" }, // 10.2
    { type: "dynamic", format: "bip" }, // 10.3
    { type: "dynamic", format: "bsq" }, // 10.3
    { type: "dynamic", format: "lerc" }, // 10.3
  ];
  return formats;
}
