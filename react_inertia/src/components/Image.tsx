"use client"

import React, { useState } from "react"
import NextImage, { ImageProps } from "next/image"

interface Props extends Omit<ImageProps, "alt"> {
  alt?: string
  wrapperClass?: string
  loadingElement?: React.ReactNode
}

const Image = ({ className = "", wrapperClass = "", ...props }: Props) => {
  const [isLoaded, setIsLoaded] = useState(false)
  if (props.loadingElement) {
    return (
      <div className={`relative h-auto w-full ${wrapperClass}`}>
        {!isLoaded && props.loadingElement}

        <NextImage
          {...props}
          src={props.src || ""}
          width={props.width || 0}
          height={props.height || 0}
          sizes={props.sizes || "100vw"}
          alt={props.alt || "Graphic"}
          unoptimized
          className={`object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
          onLoadingComplete={() => setIsLoaded(true)}
        />
      </div>
    )
  }

  return (
    <NextImage
      {...props}
      src={props.src || ""}
      width={props.width || 0}
      height={props.height || 0}
      sizes={props.sizes || "100vw"}
      alt={props.alt || "Graphic"}
      unoptimized
      className={`object-cover ${className || ""}`}
    />
  )
}

export default Image
