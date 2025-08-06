# Use the official .NET 8 SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["GameAPI/GameAPI.csproj", "GameAPI/"]
RUN dotnet restore "GameAPI/GameAPI.csproj"
COPY . .
WORKDIR "/src/GameAPI"
RUN dotnet publish "GameAPI.csproj" -c Release -o /app/publish

# Use the official .NET 8 ASP.NET runtime image for the runtime environment
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "GameAPI.dll"]
