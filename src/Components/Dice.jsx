export default function Dice(props) {
  const styles = {
    background: props.isHeld ? '#8F7DFF' : null,
    color: props.isHeld ? '#ffffff' : null
  };

  return (
    <div
      className=" rounded h-12 w-12 md:h-20 md:w-20 active:scale-95 duration-300 shadow-md md:shadow-lg grid place-content-center text-xl md:text-3xl font-semibold select-none cursor-pointer"
      style={styles}
      onClick={props.hold}
    >
      {props.value}
    </div>
  );
}
