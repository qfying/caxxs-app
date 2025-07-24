type Props = {
  carddata: any
}

// width: 347;
// height: 117;
// border-radius: 20px;
// angle: 0 deg;
// opacity: 1;
// border-width: 0.5px;
// gap: 10px;
// padding-top: 22px;
// padding-right: 15px;
// padding-bottom: 22px;
// padding-left: 20px;
// background: #FFFFFF26;
// border: 0.5px solid;

// border-image-source: linear-gradient(124.34deg, rgba(255, 255, 255, 0.35) 29.71%, rgba(255, 255, 255, 0.7) 55.17%, rgba(255, 255, 255, 0.35) 81.42%);
// backdrop-filter: blur(30px)






const Carddemo = ({ carddata }: Props) => {
  return (
    <div style={{ width: "100%", height: "117px", borderRadius: "20px", display: "grid", gap: "10px", padding: "20px", background: "#FFFFFF26", border: "0.5px solid #FFFFFF80", backdropFilter: "blur(30px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: "600", fontSize: "16px" }}>{carddata.name}</div>
        <div style={{ display: "flex" }}>
          <img src="/assets/icon/clock.svg" alt="" style={{ width: "12px", height: "12px", marginRight: "4px" }} />
          <div style={{ fontSize: "12px" }}>{carddata.time}</div>
        </div>
      </div>
      <div >
        <img src="/assets/icon/user.svg" alt="" />
        <span style={{ fontSize: "12px", color: "#FFFFFF", opacity: "0.5", marginLeft: "4px" }}>{carddata.company}</span>

      </div>
      <div >
        <img src="/assets/icon/send.svg" alt="" />
        <span style={{ fontSize: "12px", color: "#FFFFFF", opacity: "0.5", marginLeft: "4px" }}>{carddata.lacate}</span>
      </div>
    </div>
  )

}

export default Carddemo