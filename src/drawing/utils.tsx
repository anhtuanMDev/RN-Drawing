import {
  Skia,
  PaintStyle,
  StrokeCap,
  StrokeJoin,
} from '@shopify/react-native-skia';
import { CurrentPath } from '../store';
import { PermissionsAndroid, Platform } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

const getPaint = (strokeWidth: number, color: string) => {
  const paint = Skia.Paint();
  paint.setStrokeWidth(strokeWidth);
  paint.setStrokeMiter(5);
  paint.setStyle(PaintStyle.Stroke);
  paint.setStrokeCap(StrokeCap.Round);
  paint.setStrokeJoin(StrokeJoin.Round);
  paint.setAntiAlias(true);
  paint.setColor(Skia.Color(color));
  return paint;
};

const makeSvgFromPaths = (
  paths: CurrentPath[],
  options: {
    width: number;
    height: number;
    backgroundColor?: string;
  }
) => {
  return `<svg width="${options.width}" height="${options.height}" viewBox="0 0 ${options.width} ${options.height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${options.width}" height="${options.height}" fill="${options.backgroundColor || 'white'}"/>
  <g>
    ${paths
      .map((path) =>
        path.paint && path.path
          ? `<path d="${path.path.toSVGString()}" stroke="${path.color}" stroke-width="${path.paint.getStrokeWidth()}" stroke-linecap="round" stroke-linejoin="round"/>`
          : ''
      )
      .join('\n    ')}
  </g>
</svg>`;
};

async function hasAndroidPermission() {
  const getCheckPermissionPromise = async () => {
    if (+Platform.Version >= 33) {
      const [hasReadMediaImagesPermission, hasReadMediaVideoPermission] = await Promise.all([
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES),
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO),
      ]);
      return hasReadMediaImagesPermission && hasReadMediaVideoPermission;
    } else {
      return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    }
  };

  const hasPermission = await getCheckPermissionPromise();
  if (hasPermission) {
    return true;
  }
  const getRequestPermissionPromise = () => {
    if (+Platform.Version >= 33) {
      return PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]).then(
        (statuses) =>
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
            PermissionsAndroid.RESULTS.GRANTED,
      );
    } else {
      return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then((status) => status === PermissionsAndroid.RESULTS.GRANTED);
    }
  };

  return await getRequestPermissionPromise();
}

async function savePicture(uri: string) {
  if (Platform.OS === "android" && !(await hasAndroidPermission())) {
    return;
  }

  CameraRoll.saveAsset(uri, { type: 'photo' })
};

const utils = { getPaint, makeSvgFromPaths, savePicture };

export default utils;