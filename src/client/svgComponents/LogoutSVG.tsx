import * as React from "react"

function LogoutSVG(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={45}
      height={33}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.201 0c-2.32 0-4.297.86-5.844 2.406C1.725 4.04.951 6.016.951 8.25v16.5c0 2.32.774 4.297 2.406 5.844C4.904 32.227 6.881 33 9.201 33h7.219c.258 0 .515-.086.687-.258a1.09 1.09 0 00.344-.773v-2.063c0-.258-.172-.515-.344-.687-.171-.172-.43-.344-.687-.344H9.2c-1.203 0-2.148-.344-2.922-1.203-.86-.774-1.203-1.719-1.203-2.922V8.25c0-1.117.344-2.063 1.203-2.922.774-.773 1.72-1.203 2.922-1.203h7.219c.258 0 .515-.086.687-.258a1.09 1.09 0 00.344-.773V1.03c0-.258-.172-.515-.344-.687C16.936.172 16.677 0 16.42 0H9.2zm19.852 1.633v.086a1.09 1.09 0 01.773-.344c.258 0 .516.086.688.258l14.18 14.094c.171.257.257.515.257.773 0 .344-.086.516-.258.688L30.513 31.28c-.171.258-.429.344-.687.344-.344 0-.601-.086-.773-.344l-1.633-1.633c-.258-.171-.344-.43-.344-.773 0-.258.086-.516.344-.688l9.71-9.453H15.733c-.343 0-.601-.086-.773-.257-.172-.172-.258-.43-.258-.774v-2.406c0-.258.086-.516.258-.688a1.09 1.09 0 01.773-.343h21.399L27.42 4.812c-.258-.171-.344-.343-.344-.687 0-.258.086-.516.344-.773l1.633-1.72z"
        fill="#fff"
      />
    </svg>
  )
}

export default LogoutSVG
