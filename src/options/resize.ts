import type { ResizeOptionsPartial, Resize } from "../types/resize";
import * as extendOpt from "./extend";
import { normalizeBoolean } from "../utils";

const correctResizingTypes = {
  fit: true,
  fill: true,
  auto: true,
  fill_down: true,
  force: true,
};

const getOpt = (options: ResizeOptionsPartial): Resize | undefined =>
  options.resize || options.rs;

const test = (options: ResizeOptionsPartial): boolean =>
  Boolean(getOpt(options));

const build = (options: ResizeOptionsPartial): string => {
  const resizeOpts = getOpt(options);

  if (!resizeOpts) {
    throw new Error("resize options are undefined");
  } else if (
    resizeOpts.resizing_type &&
    !correctResizingTypes[resizeOpts.resizing_type]
  ) {
    throw new Error(`incorrect resizing_type`);
  } else if (resizeOpts.width && typeof resizeOpts.width !== "number") {
    throw new Error(`incorrect width. width must be a number`);
  } else if (resizeOpts.height && typeof resizeOpts.height !== "number") {
    throw new Error(`incorrect height. height must be a number`);
  } else if (resizeOpts.width && resizeOpts.width < 0) {
    throw new Error(`incorrect width. width must be more than 0`);
  } else if (resizeOpts.height && resizeOpts.height < 0) {
    throw new Error(`incorrect height. height must be more than 0`);
  }

  const resizingType = resizeOpts.resizing_type || "";
  const width = resizeOpts.width || "";
  const height = resizeOpts.height || "";
  const enlarge =
    resizeOpts.enlarge === undefined
      ? ""
      : normalizeBoolean(resizeOpts.enlarge);
  const extend = extendOpt.test(resizeOpts)
    ? extendOpt.build(resizeOpts, { headless: true })
    : "";

  const result =
    `${resizingType}:${width}:${height}:${enlarge}:${extend}`.replace(
      /:+$/,
      ""
    );

  return `rs:${result}`;
};

export { test, build };
