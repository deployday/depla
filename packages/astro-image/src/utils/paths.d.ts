import { TransformOptions } from '../loaders/index.js';
export declare function isRemoteImage(src: string): boolean;
export declare function extname(src: string): string;
export declare function propsToFilename(transform: TransformOptions): string;
export declare function appendForwardSlash(path: string): string;
export declare function prependForwardSlash(path: string): string;
export declare function removeTrailingForwardSlash(path: string): string;
export declare function removeLeadingForwardSlash(path: string): string;
export declare function trimSlashes(path: string): string;
export declare function joinPaths(...paths: (string | undefined)[]): string;