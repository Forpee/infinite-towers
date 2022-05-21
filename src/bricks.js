export function getBrick(index, number) {
  let radius = 3;
  let angle = index * 2 * Math.PI / number;

  let mesh = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1, 1),
    new THREE.MeshLambertMaterial({
      color: 0xff0000,
    })



  );

}