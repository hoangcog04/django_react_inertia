import React from "react"

export default function CustomNotice() {
  return (
    <>
      <h2 className="mb-5 text-2xl font-bold uppercase">Chú ý</h2>
      <p className="mb-2.5">Nhập đầy đủ các thông tin dưới đây</p>
      <p>
        Lưu ý các trường đánh dấu <span className="text-[#f00000]">(*)</span> là{" "}
        <span className="text-red-500">bắt buộc</span>
      </p>
    </>
  )
}
