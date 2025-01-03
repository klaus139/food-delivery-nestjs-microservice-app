"use client"
import { ApolloProvider } from "@apollo/client";
// 1. import `NextUIProvider` component
import {NextUIProvider} from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { graphqlClient } from "../graphql/gql.setup";

export function Providers({children}:{children:React.ReactNode}) {
  // 2. Wrap NextUIProvider at the root of your app
  return (
    <ApolloProvider client={graphqlClient}>
    <NextUIProvider >
      <NextThemesProvider attribute='class' defaultTheme="dark">
      {children}
      </NextThemesProvider>
    </NextUIProvider>
    </ApolloProvider>
  );
}