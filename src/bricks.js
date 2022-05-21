import * as THREE from 'three';

export function getBrick(index, number) {
  let radius = 3;
  let angle = index * 2 * Math.PI / number;

  let mesh = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1, 1),
    new THREE.MeshLambertMaterial({
      color: 0xff0000,
    })
  );

  mesh.position.set(
    radius * Math.sin(angle),
    0,
    radius * Math.cos(angle)
  );

  mesh.rotation.y = angle;

  return mesh;

}